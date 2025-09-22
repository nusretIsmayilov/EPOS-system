import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

export default function UpdateDataForm({
  onSave,
  onCancel,
  initialData,
  isOpen,
  fields,
}: {
  onSave?: () => void;
  onCancel?: () => void;
  initialData?: any;
  isOpen?: boolean;
  fields?: any;
}) {
  console.log(initialData);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={onSave}
        className="w-[500px] h-[520px] bg-white space-y-3.5  rounded-[20px] pt-4"
      >
        <Input
          type="text"
          placeholder="Enter İtem Name"
          required
          className="bg-gray-200 w-[450px] h-[50px] mx-auto"
        />
        <Input
          type="number"
          placeholder="Price"
          required
          className="bg-gray-200 w-[450px] h-[50px] mx-auto"
        />
        <Input type="checkbox" />
        <Input
          type="number"
          placeholder="Calories"
          className="bg-gray-200 w-[450px] h-[50px] mx-auto"
        />
        <Input
          type="text"
          placeholder="Description"
          className="bg-gray-200 w-[450px] h-[50px] mx-auto"
        />
        <Input
          type="file"
          required
          className="bg-gray-200 w-[450px] h-[50px] mx-auto"
        />
        <Input
          type="number"
          placeholder="Prep time"
          className="bg-gray-200 w-[450px] h-[50px] mx-auto"
        />

        <Button onClick={onCancel} className="text-black bg-white">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
