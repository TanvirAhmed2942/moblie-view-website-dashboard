"use client";

import { useState, useMemo } from "react";
import CommentTreeExample from "./CommentTreeExample";
import SmallPageInfo from "@/components/SmallPageInfo";
import { Button } from "@/components/ui/button";
import { HiPlus } from "react-icons/hi";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCommunityQuery,
  useCreateCommunityMutation,
  useCreateCommunityReplyMutation,
} from "@/redux/Apis/communityApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

// API Response interfaces
interface ApiUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  profile?: string;
}

interface ApiAnswer {
  userId?: ApiUser;
  User: string;
  date: string;
  comments: string;
  _id: string;
}

interface ApiCommunityPost {
  _id: string;
  userId?: ApiUser;
  question?: string;
  tags?: string[];
  answers?: ApiAnswer[];
  createdAt: string;
  updatedAt: string;
  answersCount?: number;
}

// interface ApiResponse {
//   statusCode: number;
//   success: boolean;
//   message: string;
//   data: {
//     meta: {
//       total: number;
//       limit: number;
//       page: number;
//       totalPage: number;
//     };
//     result: ApiCommunityPost[];
//   };
// }

// Helper function to transform API data to Comment format
const transformApiDataToComments = (apiData: ApiCommunityPost[]): Comment[] => {
  return apiData.map((post) => ({
    id: post._id,
    originalId: post._id, // Preserve original API ID
    author: {
      name: post.userId?.name || "Unknown User",
      username: post.userId?.email?.split("@")[0] || "unknown", // Use email prefix as username
      avatar: post.userId?.profile,
      role: post.userId?.role,
    },
    content: post.question || "No content",
    timestamp: post.createdAt,
    likes: 0, // API doesn't provide likes, defaulting to 0
    isLiked: false,
    replies: (post.answers || []).map((answer) => ({
      id: answer._id,
      originalReplyId: answer._id, // Preserve original API ID for replies
      author: {
        name: answer.userId?.name || "Unknown User",
        username: answer.userId?.email?.split("@")[0] || "unknown",
        avatar: answer.userId?.profile,
        role: answer.userId?.role,
      },
      content: answer.comments || "No comment provided",
      timestamp: answer.date,
      likes: 0,
      isLiked: false,
    })),
  }));
};

export default function CommunityLayout() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  // Fetch community data from API
  const {
    data: communityData,
    isLoading,
    error,
    refetch,
  } = useGetCommunityQuery({ page, limit, sort: sortBy });

  const [createCommunity, { isLoading: isCreating }] =
    useCreateCommunityMutation();
  const [createCommunityReply, { isLoading: isCreatingReply }] =
    useCreateCommunityReplyMutation();
  const toast = useToast();

  // Transform API data to comments format
  const comments = useMemo(() => {
    if (communityData?.data?.result) {
      return transformApiDataToComments(communityData.data.result);
    }
    return [];
  }, [communityData]);

  const [localComments, setLocalComments] = useState<Comment[]>([]);

  // Handle create new post
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error("Please enter a question or discussion topic.");
      return;
    }

    try {
      await createCommunity({
        question: newPostContent.trim(),
      }).unwrap();
      toast.success("Community post created successfully!");
      setNewPostContent("");
      setIsAddModalOpen(false);
      refetch(); // Refresh the data
    } catch (error: unknown) {
      console.log("Failed to create community post:", error);

      // Handle specific error messages
      const errorData = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ message?: string }>;
        };
      };
      if (errorData?.data?.message) {
        if (errorData.data.message.includes("not allowed to create")) {
          toast.error("You don't have permission to create posts.");
        } else if (errorData.data.message.includes("validation")) {
          toast.error("Please check your input and try again.");
        } else {
          toast.error(errorData.data.message);
        }
      } else if (errorData?.data?.errorMessages?.[0]?.message) {
        toast.error(errorData.data.errorMessages[0].message);
      } else {
        toast.error("Failed to create community post. Please try again.");
      }
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // Reset to first page when sorting changes
  };

  // Handle edit and delete operations
  const handleEdit = (commentId: string, newContent: string) => {
    // Update local comments with the edited content
    const updateCommentContent = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content: newContent,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentContent(comment.replies),
          };
        }
        return comment;
      });
    };

    setLocalComments((prev) => updateCommentContent(prev));
  };

  const handleDelete = (commentId: string) => {
    // Remove the comment from local state
    const removeComment = (comments: Comment[]): Comment[] => {
      return comments.filter((comment) => comment.id !== commentId);
    };

    setLocalComments((prev) => removeComment(prev));
    // Refetch data to get updated list from server
    refetch();
  };

  // Combine API data with local changes
  const allComments = useMemo(() => {
    const combined = [...comments];
    // Add any local comments that aren't in the API data
    localComments.forEach((localComment) => {
      if (!combined.find((c) => c.id === localComment.id)) {
        combined.push(localComment);
      }
    });
    return combined;
  }, [comments, localComments]);

  const handleReply = async (
    commentId: string,
    content: string
  ): Promise<void> => {
    try {
      // Use the originalId for API calls
      const apiCommentId =
        comments.find((c) => c.id === commentId)?.originalId || commentId;

      const response = await createCommunityReply({
        communityId: apiCommentId,
        comments: content,
      }).unwrap();

      console.log("Reply created successfully:", response);
      toast.success("Reply posted successfully!");

      // Refresh the data to get the updated replies from the server
      refetch();
    } catch (error: unknown) {
      console.log("Failed to create reply:", error);

      // Handle specific error messages
      const errorData = error as {
        data?: {
          message?: string;
          errorMessages?: Array<{ message?: string }>;
        };
      };
      if (errorData?.data?.message) {
        if (errorData.data.message.includes("not allowed to create")) {
          toast.error("You don't have permission to create replies.");
        } else if (errorData.data.message.includes("validation")) {
          toast.error("Please check your input and try again.");
        } else {
          toast.error(errorData.data.message);
        }
      } else if (errorData?.data?.errorMessages?.[0]?.message) {
        toast.error(errorData.data.errorMessages[0].message);
      } else {
        toast.error("Failed to create reply. Please try again.");
      }
    }
  };

  const handleEditReply = (
    commentId: string,
    replyId: string,
    content: string
  ): void => {
    const updateReplyContent = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies?.map((reply) =>
              reply.id === replyId ? { ...reply, content } : reply
            ),
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateReplyContent(comment.replies),
          };
        }
        return comment;
      });
    };

    setLocalComments((prev) => updateReplyContent(prev));
  };

  const handleDeleteReply = (commentId: string, replyId: string): void => {
    const removeReply = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies?.filter((reply) => reply.id !== replyId),
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: removeReply(comment.replies),
          };
        }
        return comment;
      });
    };

    setLocalComments((prev) => removeReply(prev));
  };

  const handleLike = (commentId: string): void => {
    const toggleLike = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked
              ? (comment.likes || 0) - 1
              : (comment.likes || 0) + 1,
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: toggleLike(comment.replies),
          };
        }
        return comment;
      });
    };

    // Update local comments with the like change
    setLocalComments((prev) => toggleLike(prev));
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen space-y-4">
        <div className="max-w-full mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <SmallPageInfo
              title="Community"
              description="Here is an overview of your community"
            />
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Latest</SelectItem>
                  <SelectItem value="-createdAt">Oldest</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <HiPlus size={15} /> Add New Community Post
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <div className="text-muted-foreground">
              Loading community posts...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen space-y-4">
        <div className="max-w-full mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <SmallPageInfo
              title="Community"
              description="Here is an overview of your community"
            />
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Latest</SelectItem>
                  <SelectItem value="-createdAt">Oldest</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <HiPlus size={15} /> Add New Community Post
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-red-500 mb-2">
              Error loading community posts
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-4">
      <div className="max-w-full mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <SmallPageInfo
            title="Community"
            description="Here is an overview of your community"
          />
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Latest</SelectItem>
                <SelectItem value="createdAt">Oldest</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <HiPlus size={15} /> Add New Community Post
            </Button>
          </div>
        </div>
        <CommentTreeExample
          className=""
          comments={allComments}
          onReply={handleReply}
          onToggleLike={handleLike}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onEditReply={handleEditReply}
          onDeleteReply={handleDeleteReply}
          isCreatingReply={isCreatingReply}
        />

        {/* Pagination */}
        {communityData?.data?.meta && communityData.data.meta.totalPage > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && handlePageChange(page - 1)}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    size="default"
                  />
                </PaginationItem>

                {Array.from(
                  { length: communityData.data.meta.totalPage },
                  (_, i) => i + 1
                ).map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={page === pageNum}
                      className="cursor-pointer"
                      size="icon"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < communityData.data.meta.totalPage &&
                      handlePageChange(page + 1)
                    }
                    className={
                      page >= communityData.data.meta.totalPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                    size="default"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Add New Post Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Community Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Enter your question or discussion topic..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setNewPostContent("");
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreatePost} disabled={isCreating}>
              {isCreating ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
