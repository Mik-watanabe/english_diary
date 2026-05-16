"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { RevisedDiaryResponse } from "@/types/diary";

import { useActionState } from "react";
import saveDiary from "@/app/actions/diary/save-action";
import moment from "moment";
import { showErrorToast, showSuccessToast } from "@/lib/show-toast";
import { useRouter } from "next/navigation";

type SaveDiaryDialogProps = {
  revisedDiaryResponse: RevisedDiaryResponse | null;
  date: string;
};

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function SaveDiaryDialog({
  revisedDiaryResponse,
  date,
}: SaveDiaryDialogProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [state, formAction, isPending] = useActionState(
    saveDiary,
    initialState,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!state?.message) return;
    if (state.success) {
      showSuccessToast(state.message);
      setOpen(false);
      setTitle("");
      router.push(`/diary/${moment(date).format("YYYY-MM-DD")}`);
      return;
    }
    showErrorToast(state.message);
    setOpen(false);
    setTitle("");
    return;
  }, [state]);
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setTitle("");
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            onClick={() => setOpen(true)}
            className={
              !revisedDiaryResponse ? "cursor-not-allowed bg-gray-400" : ""
            }
            disabled={!revisedDiaryResponse}
          >
            Save Diary
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Enter a title for your diary</DialogTitle>
          </DialogHeader>

          <Input
            id="title"
            name="title"
            placeholder="Put one word to describe your diary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="my-4"
          />
          <input type="hidden" name="date" value={date} />
          <input
            type="hidden"
            name="original_content"
            value={revisedDiaryResponse?.original}
          />
          <input
            type="hidden"
            name="revised_content"
            value={revisedDiaryResponse?.revised}
          />
          <input
            type="hidden"
            name="corrections"
            value={JSON.stringify(revisedDiaryResponse?.corrections)}
          />
          <input
            type="hidden"
            name="alternative_content"
            value={revisedDiaryResponse?.alternative}
          />

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={isPending || title.trim().length === 0}
            >
              {isPending ? (
                <Spinner
                  data-icon="inline-start"
                  className="inline-block mr-2"
                />
              ) : (
                <></>
              )}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
