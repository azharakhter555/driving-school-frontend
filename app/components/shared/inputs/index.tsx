// components/shared/inputs/index.ts
export * from "@/types/types";

// Import all input components
import { TextInput } from "./TextInput";
import { TextareaInput } from "./TextareaInput";
import { SelectInput } from "./SelectInput";
import { MultiSelectInput } from "./MultiSelectInput";
import { CheckboxInput } from "./CheckboxInput";
import { RadioInput } from "./RadioInput";
import { SwitchInput } from "./SwitchInput";
import { DateInput } from "./DateInput";
import { DateRangeInput } from "./DateRangeInput";
import { TimeInput } from "./TimeInput";
import { DateTimeInput } from "./DateTimeInput";
import { NumberInput } from "./NumberInput";

import { NumberRangeInput } from "./NumberRangeInput";
import { SliderInput } from "./SliderInput";
import { RatingInput } from "./RatingInput";
import { ColorInput } from "./ColorInput";
import { FileInput } from "./FileInput";
import { ImageInput } from "./ImageInput";

// Re-export all components individually
export { 
  TextInput,
  TextareaInput,
  SelectInput,
  MultiSelectInput,
  CheckboxInput,
  RadioInput,
  SwitchInput,
  DateInput,
  DateRangeInput,
  TimeInput,
  DateTimeInput,
  NumberInput,
  NumberRangeInput,
  SliderInput,
  RatingInput,
  ColorInput,
  FileInput,
  ImageInput
};

// Re-export with consistent naming for convenience
export const Inputs = {
  Text: TextInput,
  Textarea: TextareaInput,
  Select: SelectInput,
  MultiSelect: MultiSelectInput,
  Checkbox: CheckboxInput,
  Radio: RadioInput,
  Switch: SwitchInput,
  Date: DateInput,
  DateRange: DateRangeInput,
  Time: TimeInput,
  DateTime: DateTimeInput,
  Number: NumberInput,
  NumberRange: NumberRangeInput,
  Slider: SliderInput,
  Rating: RatingInput,
  Color: ColorInput,
  File: FileInput,
  Image: ImageInput,
};