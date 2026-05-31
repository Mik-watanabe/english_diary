import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Correction } from "@/types/diary";
import { CheckCheck, Lightbulb } from "lucide-react";

type DiaryTabsProps = {
  corrections?: Correction[];
  alternative: string;
};

export default function DiaryTabs({
  corrections = [],
  alternative,
}: DiaryTabsProps) {
  const isCorrectionsEmpty = corrections?.length === 0;
  const defaultTab = isCorrectionsEmpty ? "alternative" : "corrections";
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList variant="line">
        <TabsTrigger
          value="corrections"
          className="hover:cursor-pointer"
          disabled={isCorrectionsEmpty}
        >
          <CheckCheck className="size-4" /> Corrections
        </TabsTrigger>
        <TabsTrigger value="alternative" className="hover:cursor-pointer">
          <Lightbulb className="size-4" /> Alternative
        </TabsTrigger>
      </TabsList>
      <TabsContent value="corrections">
        <Card className="mt-3 bg-white p-3 ring-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Original</TableHead>
                <TableHead>Revised</TableHead>
                <TableHead>Why</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {corrections?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <span className="rounded-md bg-[#f59e0b]/20 px-2 py-1 font-medium">
                      {item.original}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-md bg-blue-500/10 px-2 py-1 font-medium font-semibold text-blue-500">
                      {item.revised}
                    </span>
                  </TableCell>
                  <TableCell>{item.why}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>
      <TabsContent value="alternative">
        <Card className="mt-3 bg-white p-3 ring-0">
          <CardContent className="">{alternative}</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
