import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/router";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { DialogFooter, DialogHeader } from "./dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "./input";
import { Button } from "./button";
import { Textarea } from "./textarea";
import axiosInstance from "@/lib/axiosInstance";
import { useUser } from "@/lib/AuthContext";
import { Description } from "@radix-ui/react-dialog";
import { describe } from "node:test";

const ChannelDialogue = ({ isOpen, onClose, channelData, mode }: any) => {
  const { user, login } = useUser();
  // const user: any = {
  //   id: "1",
  //   name: "John Doe",
  //   email: "john@example.com",
  //   image: "https://github.com/shadcn.png?height=32&width=32",
  // };
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (channelData && mode === "edit") {
      setFormData({
        name: channelData.name || "",
        description: channelData.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [channelData, mode]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      channelname: formData.name,
      description: formData.description,
    };
    const response = await axiosInstance.patch(
      `/user/update/${user._id}`,
      payload
    );
    login(response?.data)
router.push(`/channel/${user?._id}`);
setFormData({
  name:"",
  description: ""
});
// onclose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create your channel" : "Edit your channel"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your channel name"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Channel Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tell viewers about your channel..."
            />
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Channel"
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelDialogue;
