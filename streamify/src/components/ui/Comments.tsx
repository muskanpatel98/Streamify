import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Comment {
  _id: string;
  videoid: string;
  userid: string;
  location?: string;
  likes?: string[];
  dislikes?: string[];
  commentbody: string;
  usercommented: string;
  commentedon: string;
}
const Comments = ({ videoId }: any) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { user } = useUser();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [translatedComments, setTranslatedComments] = useState<
    Record<string, string>
  >({});
  const [selectedLanguages, setSelectedLanguages] = useState<{
    [key: string]: string;
  }>({});

  const specialCharRegex = /[^a-zA-Z0-9\s.,!?'"@#&():;-]/;
  const fetchedComments = [
    {
      _id: "1",
      videoid: videoId,
      userid: "1",
      commentbody: "Great video! Really enjoyed watching this.",
      usercommented: "John Doe",
      commentedon: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      _id: "2",
      videoid: videoId,
      userid: "2",
      commentbody: "Thanks for sharing this amazing content!",
      usercommented: "Jane Smith",
      commentedon: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
  useEffect(() => {
    loadComments();
  }, [videoId]);

  // useEffect(() => {
  //   axiosInstance
  //     .get("/api/translate")
  //     .then((res) => {
  //       setLanguages(res.data);
  //     })
  //     .catch((err) => console.error("Error fetching languages:", err));
  // }, []);

  const loadComments = async () => {
    try {
      const res = await axiosInstance.get(`/api/comment/${videoId}`);
      setComments(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading history...</div>;
  }
  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    if (specialCharRegex.test(newComment)) {
      alert("Special characters are not allowed in comments.");
      return;
    }
    setIsSubmitting(true);
    try {
      let location = "Unknown";

      try {
        const locRes = await fetch("https://ipapi.co/json/");
        const locData = await locRes.json();
        location = `${locData.city}, ${locData.country_name}`;
      } catch {
        console.warn("Could not fetch location");
      }

      const res = await axiosInstance.post("/api/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        commentbody: newComment,
        usercommented: user.name,
        location,
      });

      if (res.data.comment) {
        const newCommentObj: Comment = {
          _id: Date.now().toString(),
          videoid: videoId,
          userid: user._id,
          commentbody: newComment,
          usercommented: user.name || "Anonymous",
          commentedon: new Date().toISOString(),
          location,
        };
        setComments([newCommentObj, ...comments]);
      }
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like & Dislike Button
  const handleLike = async (id: string) => {
    try {
      const res = await axiosInstance.post(`/api/comment/like`, {
        commentId: id,
        userid: user._id,
      });

      if (res.data.updatedComment) {
        // Update comment list with the new one
        setComments((prevComments) =>
          prevComments.map((c) => (c._id === id ? res.data.updatedComment : c))
        );
      }
      // reload updated comment
    } catch (err) {
      console.log("Error toggling like:", err);
    }
  };

  const handleDislike = async (id: string) => {
    try {
      const res = await axiosInstance.post(`/api/comment/dislike/`, {
        commentId: id,
        userId: user._id,
      });
      if (res.data.deleted) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      } else {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, ...res.data } : c))
        );
      }
    } catch (err) {
      console.log("Error toggling dislike:", err);
    }
  };

  //Translator
  const handleTranslate = async (id: string, targetLang: string) => {
    if (translatedComments[id]) return;
    try {
      const res = await axiosInstance.post(`/api/comment/${id}/translate`, {
        targetLang,
      });

      setTranslatedComments((prev) => ({
        ...prev,
        [id]: res.data.translated,
      }));

      // alert(`Translated: ${res.data.translated}`);
    } catch (err) {
      console.error("Translation failed:", err);
    }
  };

  const handleTranslateToggle = async (id: string, targetLang: string) => {
    if (translatedComments[id]) {
      setTranslatedComments((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } else {
      await handleTranslate(id, targetLang);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentbody);
  };

  const handleUpdateComment = async () => {
    if (!editText.trim()) return;
    try {
      const res = await axiosInstance.post(
        `/api/comment/editcomment/${editingCommentId}`,
        { commentbody: editText }
      );
      if (res.data) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === editingCommentId ? { ...c, commentbody: editText } : c
          )
        );
        setEditingCommentId(null);
        setEditText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(
        `/api/comment/deletecomment/${id}`
      );
      if (res.data.comment) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

      {user && (
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e: any) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none border-0 border-b-2 rounded-none focus-visible:ring-0"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setNewComment("")}
                disabled={!newComment.trim()}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>{comment.usercommented[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {comment.usercommented}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    {formatDistanceToNow(new Date(comment.commentedon))} ago
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.location && <> • {comment.location}</>}
                  </span>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={handleUpdateComment}
                        disabled={!editText.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm">
                      {translatedComments[comment._id] || comment.commentbody}
                    </p>
                    {comment.userid === user?._id && (
                      <div className="flex gap-2 mt-2 text-sm text-gray-500">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-l-full"
                          onClick={() => handleLike(comment._id)}
                        >
                          <ThumbsUp
                            className={`w-5 h-5 mr-2 ${
                              isLiked ? "fill-black text-black" : ""
                            }`}
                          />
                          {comment.likes?.length?.toLocaleString() || 0}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-r-full"
                          onClick={() => handleDislike(comment._id)}
                        >
                          <ThumbsDown
                            className={`w-5 h-5 mr-2 ${
                              isDisliked ? "fill-black text-black" : ""
                            }`}
                          />
                          {comment.dislikes?.length?.toLocaleString() || 0}
                        </Button>

                        <select
                          className="text-sm border rounded px-1 py-0.5 mr-2"
                          value={selectedLanguages[comment._id] || "en"}
                          onChange={(e) =>
                            setSelectedLanguages((prev) => ({
                              ...prev,
                              [comment._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select Language</option>
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="fr">French</option>
                          <option value="es">Spanish</option>
                          <option value="de">German</option>
                          <option value="zh-CN">Chinese (Simplified)</option>
                          <option value="zh-TW">Chinese (Traditional)</option>
                          <option value="ar">Arabic</option>
                          <option value="ru">Russian</option>
                          <option value="ja">Japanese</option>
                          <option value="ko">Korean</option>
                          <option value="pt">Portuguese</option>
                          <option value="it">Italian</option>
                          <option value="nl">Dutch</option>
                          <option value="sv">Swedish</option>
                          <option value="tr">Turkish</option>
                          <option value="pl">Polish</option>
                          <option value="id">Indonesian</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                          <option value="bn">Bengali</option>
                          <option value="ur">Urdu</option>
                          <option value="gu">Gujarati</option>
                          <option value="mr">Marathi</option>
                          <option value="fa">Persian</option>
                          <option value="th">Thai</option>
                          <option value="vi">Vietnamese</option>
                          <option value="he">Hebrew</option>
                          <option value="cs">Czech</option>
                          <option value="ro">Romanian</option>
                          <option value="hu">Hungarian</option>
                          <option value="el">Greek</option>
                          <option value="da">Danish</option>
                          <option value="fi">Finnish</option>
                          <option value="no">Norwegian</option>
                          <option value="sk">Slovak</option>
                          <option value="bg">Bulgarian</option>
                        </select>
                        <button
                          className="text-sm text-gray-600 mt-1 hover:underline"
                          onClick={() =>
                            handleTranslateToggle(
                              comment._id,
                              selectedLanguages[comment._id] || "en"
                            )
                          }
                        >
                          Translate
                        </button>

                        {/* {translatedComments[comment._id] && (
                          <p className="text-sm italic text-gray-600">
                            Translated: {translatedComments[comment._id]}
                          </p>
                        )} */}

                        <button onClick={() => handleEdit(comment)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(comment._id)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
