import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";

const SelectElement = ({ selectItems, value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a value" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {selectItems.map(({ id, value, label }) => (
          <SelectItem key={id} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default function UpdateDataForm({
  onSave,
  onCancel,
  initialData,
  fields,
  isOpen,
}) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e, data) => {
    e.preventDefault();
    onSave(data);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={(e)=>handleSubmit(e, formData)}
        className="flex flex-col gap-[20px] w-[550px] h-[520px] bg-white space-y-3.5  rounded-[20px] pt-4 overflow-y-auto p-10"
      >
        {fields.map(
          ({ id, label, name, type, placeholder, selectItems, isRequired }) => {
            if (type === "select") {
              return (
                <div key={id} className="w-[450px] h-[50px] mx-auto">
                  <Label htmlFor={name} className="mb-[20px]">
                    {label}
                  </Label>
                  <SelectElement
                    selectItems={selectItems}
                    value={formData[name]}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, [name]: val }))
                    }
                  />
                </div>
              );
            }

            return (
              <div className="w-[450px] h-[50px] mx-auto" key={id}>
                <Label htmlFor={name} className="mb-[20px]">
                  {label}
                </Label>
                <Input
                  type={type}
                  placeholder={placeholder}
                  required={isRequired}
                  id={name}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="bg-gray-200 w-[450px] h-[50px] mx-auto"
                />
              </div>
            );
          }
        )}
        <Button
          onClick={onCancel}
          className="text-black bg-white"
          type="button"
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
