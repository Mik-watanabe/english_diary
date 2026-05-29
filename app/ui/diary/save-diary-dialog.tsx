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
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";
import { eventCache } from "@/lib/diary/event-cache";
type SaveDiaryDialogProps = {
  revisedDiaryResponse: RevisedDiaryResponse | null;
  date: moment.Moment;
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
      setTitle("");
      eventCache.delete(date.format("YYYY-MM"));
      showSuccessToast("Diary saved!");
      router.push(`/diary/${date.format("YYYY-MM-DD")}`);
      return;
    }
    showErrorToast(state.message);
    setOpen(false);
    setTitle("");
    return;
  }, [state, router, date]);

  const isButtonDisabled =
    title.trim().length < 1 || title.trim().length > 50 || isPending;

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
            variant="outline"
            onClick={() => setOpen(true)}
            className={cn(
              "font-semibold shadow-sm",
              !revisedDiaryResponse
                ? "cursor-not-allowed border-[#E5EDF8] bg-slate-50 text-slate-400 hover:bg-slate-50 hover:text-slate-400"
                : "border-blue-500 bg-white text-blue-600 hover:cursor-pointer hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700",
            )}
            disabled={!revisedDiaryResponse}
          >
            <Save />
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
            placeholder="Max 50 characters"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="my-4 text-xs focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-300/80"
          />
          <input type="hidden" name="date" value={date.format("YYYY-MM-DD")} />
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
                  className="font-semibold hover:cursor-pointer"
                  disabled={isPending}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              disabled={isButtonDisabled}
              className="border-blue-500 bg-blue-500 font-semibold text-white hover:cursor-pointer hover:bg-blue-600 hover:text-white"
            >
              {isPending ? (
                <Spinner
                  data-icon="inline-start"
                  className="mr-2 inline-block"
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
