import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { LinkFormData } from "../types";

interface LinkFormProps {
  register: UseFormRegister<LinkFormData>;
}

export function LinkForm({ register }: LinkFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          {...register("url")}
        />
      </div>
    </div>
  );
}