"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Heart,
  Reply,
  Edit,
  Trash2,
  Loader2,
  MoreVertical,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteConfirmationDialog from "@/components/confirmation/deleteConfirmationDialog";
import {
  useUpdateCommunityMutation,
  useDeleteCommunityMutation,
  useUpdateCommunityCommentMutation,
  useDeleteCommunityCommentMutation,
  useCreateCommunityReplyMutation,
} from "@/redux/Apis/communityApi";
import { useGetAdminByAuthIdQuery } from "@/redux/Apis/authApi";
import getAuthIdFromToken from "@/utils/jwtDecode";
import useToast from "@/hooks/useToast";

// Define TypeScript interfaces
interface Author {
  name: string;
  username: string;
  avatar?: string;
  role?: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
  // Add original API IDs for proper API calls
  originalId?: string; // For main posts
  originalReplyId?: string; // For replies
}

interface CommentNodeProps {
  comment: Comment;
  depth?: number;
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onToggleLike?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onEditReply?: (commentId: string, replyId: string, content: string) => void;
  onDeleteReply?: (commentId: string, replyId: string) => void;
  showActions?: boolean;
  isDeleting?: boolean;
  deletingCommentId?: string | null;
  isReply?: boolean;
  parentCommentId?: string;
  isCreatingReply?: boolean;
  canUserEditReply?: (reply: Comment) => boolean;
}

function CommentNode({
  comment,
  depth = 0,
  onReply,
  onLike,
  onToggleLike,
  onEdit,
  onDelete,
  onEditReply,
  onDeleteReply,
  showActions = false,
  isDeleting = false,
  deletingCommentId,
  isReply = false,
  parentCommentId,
  isCreatingReply = false,
  canUserEditReply,
}: CommentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isEditReplyModalOpen, setIsEditReplyModalOpen] = useState(false);
  const [editReplyContent, setEditReplyContent] = useState("");
  const [isDeleteReplyModalOpen, setIsDeleteReplyModalOpen] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;
  const maxDepth = 6;

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleEditClick = () => {
    setEditContent(comment.content);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.id, editContent.trim());
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(comment.id);
      setIsDeleteModalOpen(false);
    }
  };

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleReplySubmit = () => {
    if (onReply && replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent("");
      setIsReplying(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyContent("");
    setIsReplying(false);
  };

  const handleEditReplyClick = () => {
    setEditReplyContent(comment.content);
    setIsEditReplyModalOpen(true);
  };

  const handleEditReplySave = () => {
    if (onEditReply && parentCommentId && editReplyContent.trim()) {
      onEditReply(parentCommentId, comment.id, editReplyContent.trim());
      setIsEditReplyModalOpen(false);
    }
  };

  const handleDeleteReplyClick = () => {
    setIsDeleteReplyModalOpen(true);
  };

  const handleDeleteReplyConfirm = () => {
    if (onDeleteReply && parentCommentId) {
      onDeleteReply(parentCommentId, comment.id);
      setIsDeleteReplyModalOpen(false);
    }
  };

  return (
    <div className="group relative">
      {/* Edit and Delete buttons - only show for top-level comments (depth 0) and when showActions is true */}
      {depth === 0 && showActions && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            onClick={handleDeleteClick}
            disabled={isDeleting && deletingCommentId === comment.id}
          >
            {isDeleting && deletingCommentId === comment.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      <div
        className="flex gap-3 py-3"
        style={{ marginLeft: `${Math.min(depth * 24, maxDepth * 24)}px` }}
      >
        {/* Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={comment.author.avatar || "https://github.com/shadcn.png"}
            alt={comment.author.name}
          />
          <AvatarFallback className="text-xs">
            {getInitials(comment.author.name)}
          </AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{comment.author.name}</span>
            {comment.author.username && (
              <span className="text-muted-foreground text-xs">
                @{comment.author.username}
              </span>
            )}
            <span className="text-muted-foreground text-xs">
              {formatTimestamp(comment.timestamp)}
            </span>
            {comment.author.role === "admin" && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                Admin
              </Badge>
            )}
          </div>

          {/* Comment text */}
          <div className="text-sm text-foreground mb-2 leading-relaxed">
            {comment.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-foreground"
              onClick={() => onToggleLike?.(comment.id)}
            >
              <Heart
                className={`h-3 w-3 mr-1 ${
                  comment.isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {comment.likes || 0}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={handleReplyClick}
                disabled={isCreatingReply}
              >
                {isCreatingReply ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Reply className="h-3 w-3 mr-1" />
                )}
                {isCreatingReply ? "Posting..." : "Reply"}
              </Button>
            )}

            {/* 3-dot dropdown for replies - only show if user can edit */}
            {isReply && canUserEditReply && canUserEditReply(comment) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEditReplyClick}>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteReplyClick}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground ml-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronRight className="h-3 w-3 mr-1" />
                )}
                {comment.replies?.length}{" "}
                {comment.replies?.length === 1 ? "reply" : "replies"}
              </Button>
            )}
          </div>

          {/* Inline Reply Input */}
          {isReplying && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="min-h-[80px] mb-2"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleReplyCancel}>
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim()}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {hasReplies && isExpanded && depth < maxDepth && (
        <div className="relative">
          {/* Connection line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-border"
            style={{ left: `${Math.min(depth * 24, maxDepth * 24) + 16}px` }}
          />

          {comment.replies?.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onLike={onLike}
              onToggleLike={onToggleLike}
              onEdit={onEdit}
              onDelete={onDelete}
              onEditReply={onEditReply}
              onDeleteReply={onDeleteReply}
              showActions={false}
              isDeleting={isDeleting}
              deletingCommentId={deletingCommentId}
              isReply={true}
              parentCommentId={comment.id}
              isCreatingReply={isCreatingReply}
              canUserEditReply={canUserEditReply}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Question/Discussion</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your question or discussion topic..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Community Post"
        itemName={
          comment.content.length > 50
            ? comment.content.substring(0, 50) + "..."
            : comment.content
        }
        itemType="community post"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />

      {/* Edit Reply Modal */}
      <Dialog
        open={isEditReplyModalOpen}
        onOpenChange={setIsEditReplyModalOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Reply</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editReplyContent}
              onChange={(e) => setEditReplyContent(e.target.value)}
              placeholder="Enter your reply..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditReplyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditReplySave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reply Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteReplyModalOpen}
        onClose={() => setIsDeleteReplyModalOpen(false)}
        onConfirm={handleDeleteReplyConfirm}
        title="Delete Reply"
        itemName={
          comment.content.length > 50
            ? comment.content.substring(0, 50) + "..."
            : comment.content
        }
        itemType="reply"
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
  );
}

interface CommentTreeProps {
  comments: Comment[];
  onReply?: (commentId: string, content: string) => void;
  onLike?: (commentId: string) => void;
  onToggleLike?: (commentId: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onEditReply?: (commentId: string, replyId: string, content: string) => void;
  onDeleteReply?: (commentId: string, replyId: string) => void;
  isCreatingReply?: boolean;
  className?: string;
}

export default function CommentTreeExample({
  comments,
  onReply,
  onLike,
  onToggleLike,
  onEdit,
  onDelete,
  onEditReply,
  onDeleteReply,
  isCreatingReply = false,
  className = "",
}: CommentTreeProps) {
  const [updateCommunity] = useUpdateCommunityMutation();
  const [deleteCommunity, { isLoading: isDeleting }] =
    useDeleteCommunityMutation();
  const [updateCommunityComment] = useUpdateCommunityCommentMutation();
  const [deleteCommunityComment] = useDeleteCommunityCommentMutation();
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const toast = useToast();

  // Get current user information
  const authId = getAuthIdFromToken();
  const { data: adminResponse } = useGetAdminByAuthIdQuery(authId, {
    skip: !authId,
  });
  const currentUser = adminResponse?.data;

  // Helper function to check if current user can edit/delete a reply
  const canUserEditReply = (reply: Comment): boolean => {
    if (!currentUser) return false;

    // Check if the reply author's email matches current user's email
    // or if current user is admin (you can modify this logic as needed)
    const isOwner = reply.author.username === currentUser.email?.split("@")[0];
    const isAdmin = currentUser.role === "admin";

    return isOwner || isAdmin;
  };

  const handleEdit = async (commentId: string, content: string) => {
    try {
      const response = await updateCommunity({
        id: commentId,
        question: content,
      }).unwrap();
      console.log("response", response);
      toast.success("Community post updated successfully!");
      if (onEdit) {
        onEdit(commentId, content);
      }
    } catch (error: unknown) {
      console.log("Failed to update community post:", error);

      // Handle specific error messages
      const errorData = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ message?: string }>;
        };
      };
      if (errorData?.data?.message) {
        if (errorData.data.message.includes("not allowed to update")) {
          toast.error("You don't have permission to edit this post.");
        } else if (errorData.data.message.includes("not found")) {
          toast.error("Post not found. It may have been deleted.");
        } else {
          toast.error(errorData.data.message);
        }
      } else if (errorData?.data?.errorMessages?.[0]?.message) {
        toast.error(errorData.data.errorMessages[0].message);
      } else {
        toast.error("Failed to update community post. Please try again.");
      }
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      setDeletingCommentId(commentId);
      const response = await deleteCommunity(commentId).unwrap();
      console.log("response", response);
      toast.success("Community post deleted successfully!");
      if (onDelete) {
        onDelete(commentId);
      }
    } catch (error: unknown) {
      console.log("Failed to delete community post:", error);

      // Handle specific error messages
      const errorData = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ message?: string }>;
        };
      };
      if (errorData?.data?.message) {
        if (
          errorData.data.message.includes("not allowed to delete") ||
          errorData.data.message.includes("not allowed to update")
        ) {
          toast.error("You don't have permission to delete this post.");
        } else if (errorData.data.message.includes("not found")) {
          toast.error("You are not allowed to update this answer.");
        } else {
          toast.error(errorData.data.message);
        }
      } else if (errorData?.data?.errorMessages?.[0]?.message) {
        toast.error(errorData.data.errorMessages[0].message);
      } else {
        toast.error("Failed to delete community post. Please try again.");
      }
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleEditReply = async (
    commentId: string,
    replyId: string,
    content: string
  ) => {
    try {
      // Find the parent comment to get the communityId and originalReplyId
      const parentComment = comments.find((c) =>
        c.replies?.some((r) => r.id === replyId)
      );
      const communityId = parentComment?.originalId || commentId;
      const reply = parentComment?.replies?.find((r) => r.id === replyId);
      const apiReplyId = reply?.originalReplyId || replyId;

      const response = await updateCommunityComment({
        communityId: communityId,
        answerId: apiReplyId,
        comments: content,
      }).unwrap();
      console.log("response", response);
      toast.success("Reply updated successfully!");
      if (onEditReply) {
        onEditReply(commentId, replyId, content);
      }
    } catch (error: unknown) {
      console.log("Failed to update reply:", error);

      // Handle specific error messages
      const errorData = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ message?: string }>;
        };
      };
      if (errorData?.data?.message) {
        if (errorData.data.message.includes("not allowed to update")) {
          toast.error("You don't have permission to edit this reply.");
        } else if (errorData.data.message.includes("not found")) {
          toast.error("Reply not found. It may have been deleted.");
        } else {
          toast.error(errorData.data.message);
        }
      } else if (errorData?.data?.errorMessages?.[0]?.message) {
        toast.error(errorData.data.errorMessages[0].message);
      } else {
        toast.error("Failed to update reply. Please try again.");
      }
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      // Find the parent comment to get the communityId and originalReplyId
      const parentComment = comments.find((c) =>
        c.replies?.some((r) => r.id === replyId)
      );
      const communityId = parentComment?.originalId || commentId;
      const reply = parentComment?.replies?.find((r) => r.id === replyId);
      const apiReplyId = reply?.originalReplyId || replyId;

      setDeletingCommentId(replyId);
      const response = await deleteCommunityComment({
        communityId: communityId,
        answerId: apiReplyId,
      }).unwrap();
      console.log("response", response);
      toast.success("Reply deleted successfully!");
      if (onDeleteReply) {
        onDeleteReply(commentId, replyId);
      }
    } catch (error: unknown) {
      console.log("Failed to delete reply:", error);

      // Handle specific error messages
      const errorData = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ message?: string }>;
        };
      };
      if (errorData?.data?.message) {
        if (
          errorData.data.message.includes("not allowed to delete") ||
          errorData.data.message.includes("not allowed to update")
        ) {
          toast.error("You don't have permission to delete this reply.");
        } else if (errorData.data.message.includes("not found")) {
          toast.error("Reply not found. It may have already been deleted.");
        } else {
          toast.error(errorData.data.message);
        }
      } else if (errorData?.data?.errorMessages?.[0]?.message) {
        toast.error(errorData.data.errorMessages[0].message);
      } else {
        toast.error("Failed to delete reply. Please try again.");
      }
    } finally {
      setDeletingCommentId(null);
    }
  };
  if (!comments || comments.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-8 text-muted-foreground ${className}`}
      >
        <MessageCircle className="h-8 w-8 mb-2" />
        <p className="text-sm">No comments yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <CommentNode
            comment={comment}
            onReply={onReply}
            onLike={onLike}
            onToggleLike={onToggleLike}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onEditReply={handleEditReply}
            onDeleteReply={handleDeleteReply}
            showActions={true}
            isDeleting={isDeleting}
            deletingCommentId={deletingCommentId}
            canUserEditReply={canUserEditReply}
          />
        </div>
      ))}
    </div>
  );
}
