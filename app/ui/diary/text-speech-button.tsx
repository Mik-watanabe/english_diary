"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Volume2 } from "lucide-react";
import { playSpeech } from "@/lib/text-to-speech/play-speech";

type TextSpeechButtonProps = {
  //   onHandleTextToSpeech: (text: string) => void;
  revisedText: string;
};
export default function TextSpeechButton({
  revisedText,
}: TextSpeechButtonProps) {
  const [loading, setLoading] = useState(false);

  // const [textToSpeech, setTextToSpeech] = useState<string>("");
  const handleTextToSpeech = async (text: string) => {

    try {
      setLoading(true);
      await playSpeech(text);
    } catch (error) {
      console.error("Error playing speech", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    // TODO: Add stop / resume functionality
    <Button
        aria-label="Play speech"
      disabled={loading}
      variant="outline"
      size="icon"
      className="hover:cursor-pointer"
      onClick={() => handleTextToSpeech(revisedText)}
    >
      {loading ? <Pause className="w-2 h-2"/> : <Volume2 className="w-2 h-2" />}
    </Button>
  );
}
