import { Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <div className="text-brand grid flex-1 place-items-center py-20">
      <Spinner className="size-8" />
    </div>
  );
}
