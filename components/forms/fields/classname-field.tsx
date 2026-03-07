import { Input, Label, TextField } from "@heroui/react";

type ClassNameFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ClassNameField({
  value,
  onChange,
}: ClassNameFieldProps) {
  return (
    <TextField value={value} onChange={onChange} type="text" name="className">
      <Label>Class Name</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </TextField>
  );
}
