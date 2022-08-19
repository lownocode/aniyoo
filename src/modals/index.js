import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { AnimeSetList } from "./AnimeSetList";
import { AnimeWatchedBefore } from "./AnimeWatchedBefore";
import { CommentActions } from "./CommentActions";
import { ConfirmExit } from "./ConfirmExit";
import { DeleteComment } from "./DeleteComment";
import { EditComment } from "./EditComment";
import { SelectVideoSource } from "./SelectVideoSource";
import { SetStatus } from "./SetStatus";
import { SocialNetworks } from "./SocialNetworks";

export const BottomModalContent = () => {
    const { modal } = useSelector(state => state.app);

    const Modal = {
        "none": null,
        "CONFIRM_EXIT": ConfirmExit,
        "SET_STATUS": SetStatus,
        "ANIME_SET_LIST": AnimeSetList,
        "COMMENT_ACTIONS": CommentActions,
        "EDIT_COMMENT": EditComment,
        "DELETE_COMMENT": DeleteComment,
        "SELECT_VIDEO_SOURCE": SelectVideoSource,
        "ANIME_WATCHED_BEFORE": AnimeWatchedBefore,
        "SOCIAL_NETWORKS": SocialNetworks,
    }[modal.id];

    return <Modal {...modal.props} />
};