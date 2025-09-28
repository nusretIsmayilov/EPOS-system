import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

const SelectElement = ({ selectItems, value, onChange }: any) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a value" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {selectItems?.map(({ id, value, label }: any) => (
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
  fields = [],
  isOpen,
}: any) {
  const [formData, setFormData] = useState<any>(initialData || {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getMissingRequiredFields = (data: any) => {
    return (fields || [])
      .filter((f: any) => f.isRequired)
      .filter((f: any) => {
        const val = data?.[f.name];
        return val === undefined || val === null || val === "";
      })
      .map((f: any) => f.label || f.name);
  };

  const handleSubmit = (e: React.FormEvent, data: any) => {
    e.preventDefault();
    const missing = getMissingRequiredFields(data);
    if (missing.length > 0) {
      window.alert(`Please fill in: ${missing.join(", ")}`);
      return;
    }
    onSave(data);
    onCancel();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      const confirmSave = window.confirm("Do you want to save changes?");
      if (confirmSave) {
        const missing = getMissingRequiredFields(formData);
        if (missing.length > 0) {
          window.alert(`Please fill in: ${missing.join(", ")}`);
          return;
        }
        onSave(formData);
        onCancel();
      } else {
        onCancel();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <form
        ref={formRef}
        onSubmit={(e) => handleSubmit(e, formData)}
        className="flex flex-col gap-[20px] w-[550px] h-[520px] bg-white space-y-3.5 rounded-[20px] pt-4 overflow-y-auto p-10"
      >
        {fields.map(
          ({ id, label, name, type, placeholder, selectItems, isRequired }: any) => {
            if (type === "select") {
              return (
                <div key={id} className="w-[450px] h-[50px] mx-auto">
                  <Label htmlFor={name} className="mb-[20px]">
                    {label}
                  </Label>
                  <SelectElement
                    selectItems={selectItems}
                    value={formData[name]}
                    onChange={(val: any) =>
                      setFormData((prev: any) => ({ ...prev, [name]: val }))
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
                  value={formData[name] ?? ""}
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
