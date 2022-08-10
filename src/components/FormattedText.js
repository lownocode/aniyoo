import React from "react";
import { Text, View } from "react-native";
class TextExtraction {
    constructor(text, patterns) {
        this.text = text;
        this.patterns = patterns || [];
    }
  
    parse() {
        let parsedTexts = [{ children: this.text }];
        this.patterns.forEach((pattern) => {
            let newParts = [];
    
            const tmp = pattern.nonExhaustiveModeMaxMatchCount || 0;
            const numberOfMatchesPermitted = Math.min(
                Math.max(Number.isInteger(tmp) ? tmp : 0, 0) || Number.POSITIVE_INFINITY,
                Number.POSITIVE_INFINITY,
            );
    
            let currentMatches = 0;
    
            parsedTexts.forEach((parsedText) => {
                if (parsedText._matched) {
                    newParts.push(parsedText);
                    return;
                }
        
                let parts = [];
                let textLeft = parsedText.children;
                let indexOfMatchedString = 0;
        
                let matches;
                pattern.pattern.lastIndex = 0;
                while (textLeft && (matches = pattern.pattern.exec(textLeft))) {
                    let previousText = textLeft.substr(0, matches.index);
                    indexOfMatchedString = matches.index;
        
                    if (++currentMatches > numberOfMatchesPermitted) {
                        break;
                    }
        
                    parts.push({ children: previousText });
        
                    parts.push(
                        this.getMatchedPart(
                            pattern,
                            matches[0],
                            matches,
                            indexOfMatchedString,
                        ),
                    );
                    // console.log(parts)
        
                    textLeft = textLeft.substr(matches.index + matches[0].length);
                    indexOfMatchedString += matches[0].length - 1;
                    pattern.pattern.lastIndex = 0;
                }
        
                parts.push({ children: textLeft });
        
                newParts.push(...parts);
            });
    
            parsedTexts = newParts;
        });
    
        parsedTexts.forEach((parsedText) => delete parsedText._matched);
    
        return parsedTexts.filter((t) => !!t.children);
    }

    getMatchedPart(matchedPattern, text, matches, index) {
      let props = {};
  
      Object.keys(matchedPattern).forEach((key) => {
        if (
            key === 'pattern' ||
            key === 'renderText' ||
            key === 'nonExhaustiveModeMaxMatchCount'
            ) {
            return;
        }
        if (typeof matchedPattern[key] === 'function') {
            props[key] = () => matchedPattern[key](text, index);
        } else {
            props[key] = matchedPattern[key];
        }
      });
  
      let children = text;

      if (
        matchedPattern.renderText &&
        typeof matchedPattern.renderText === 'function'
      ) {
        children = matchedPattern.renderText(text, matches);
      }

      if(matchedPattern["symbol"]) {
        children = children.split(matchedPattern["symbol"]).join("");
      }
  
      return {
        ...props,
        children: children,
        _matched: true,
      };
    }
};

const PATTERNS = {
    url: /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&amp;]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi,
    bold: /\*(.*?)\*/g,
    crossedOut: /\-(.*?)\-/g,
    underline: /\_(.*?)\_/g,
    slantRight: /\/(.*?)\//g,
    copy: /\`(.*?)\`/g,
    hyperlink: /\[(.*?)\]/g,
};

export const FormattedText = (props) => {
    const { 
        patterns, 
        children,
        style
    } = props;

    const getPatterns = () => {
        return patterns.map((option) => {
            const { type, ...patternOption } = option;

            if (type) {
                if (!PATTERNS[type]) {
                    throw new Error(`${option.type} is not a supported type`);
                }
                
                patternOption.pattern = PATTERNS[type];
            }

            return patternOption;
        });
    }

    const getParsedText = () => {
        if (!patterns) {
            return children;
        }
        if (typeof children !== 'string') {
            return children;
        }

        const textExtraction = new TextExtraction(
            children,
            getPatterns(),
        );

        return textExtraction.parse().map((props, index) => {
            const { style, children, onPress } = props;

            return (
                <Text
                key={`parsedText-${index}`}
                style={style}
                onPress={onPress}
                >
                    {children}
                </Text>
            );
        });
    }

    return (
      <Text style={style}>
        {
            getParsedText()
        }
      </Text>
    );
}