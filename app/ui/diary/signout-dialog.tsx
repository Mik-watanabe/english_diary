"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "@/app/actions/signout-action";
import { toast } from "sonner";

export default function SignoutDialog({
  isOpen,
  onSetOpen,
}: {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
}) {
  const handleSignOut = async () => {
    try {
      await signOut();
      onSetOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign out");
    }
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        onSetOpen(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-sm p-6" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Are you sure you want to sign out?
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          <Button
            className="text-md rounded-full border-blue-500 bg-blue-500 py-5 font-semibold text-white hover:bg-blue-600 hover:cursor-pointer"
            onClick={() => handleSignOut()}
          >
            Sign out
          </Button>
          <Button
            className="text-md rounded-full border border-gray-300 bg-white py-5 font-semibold text-black hover:bg-gray-200 hover:cursor-pointer"
            onClick={() => onSetOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
