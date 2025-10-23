import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import type { DemoFormValues } from './demo-form';

type DemoFormFieldsProps = {
  errors: FieldErrors<DemoFormValues>;
  register: UseFormRegister<DemoFormValues>;
  currentLevel: DemoFormValues['current_level'];
  onLevelChange: (value: DemoFormValues['current_level']) => void;
  consent: boolean;
  onConsentChange: (value: boolean) => void;
  isSubmitting: boolean;
};

type FieldConfig = {
  id: keyof DemoFormValues;
  label: string;
  type?: string;
  min?: number;
  max?: number;
  component: 'input' | 'textarea';
};

const textFields: FieldConfig[] = [
  { id: 'name', label: 'Name', component: 'input' },
  { id: 'email', label: 'Email', type: 'email', component: 'input' }
];

const numberFields: FieldConfig[] = [
  { id: 'time_per_week_hours', label: 'Hours per week', type: 'number', min: 1, max: 60, component: 'input' },
  { id: 'deadline_weeks', label: 'Deadline (weeks)', type: 'number', min: 2, max: 52, component: 'input' }
];

const goalField: FieldConfig = { id: 'goal', label: 'What are you hoping to achieve?', component: 'textarea' };

export function DemoFormFields({
  errors,
  register,
  currentLevel,
  onLevelChange,
  consent,
  onConsentChange,
  isSubmitting
}: DemoFormFieldsProps) {
  const renderField = (field: FieldConfig) => {
    const error = errors[field.id]?.message;
    const errorId = error ? `${String(field.id)}-error` : undefined;
    const props =
      field.type === 'number'
        ? { inputMode: 'numeric' as const, min: field.min, max: field.max, ...register(field.id, { valueAsNumber: true }) }
        : { type: field.type, ...register(field.id) };

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={String(field.id)}>{field.label}</Label>
        {field.component === 'textarea' ? (
          <Textarea id={String(field.id)} aria-invalid={Boolean(error)} aria-describedby={errorId} rows={4} {...props} />
        ) : (
          <Input id={String(field.id)} aria-invalid={Boolean(error)} aria-describedby={errorId} {...props} />
        )}
        {error ? <p className="text-sm text-destructive" id={errorId}>{error}</p> : null}
      </div>
    );
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">{textFields.map(renderField)}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="current_level">Current level</Label>
          <Select value={currentLevel} onValueChange={(value) => onLevelChange(value as DemoFormValues['current_level'])}>
            <SelectTrigger
              id="current_level"
              aria-invalid={Boolean(errors.current_level)}
              aria-describedby={errors.current_level ? 'current_level-error' : undefined}
            >
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          {errors.current_level ? (
            <p className="text-sm text-destructive" id="current_level-error">
              {errors.current_level.message}
            </p>
          ) : null}
        </div>
        {numberFields.map(renderField)}
      </div>
      {renderField(goalField)}
      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          aria-invalid={Boolean(errors.consent)}
          checked={consent}
          onCheckedChange={(checked) => onConsentChange(Boolean(checked))}
        />
        <div className="space-y-1 text-sm">
          <Label htmlFor="consent" className="cursor-pointer text-sm font-medium">
            I consent to AI Mentor processing this intake to generate a roadmap.
          </Label>
          {errors.consent ? <p className="text-sm text-destructive">{errors.consent.message}</p> : null}
        </div>
      </div>
      <Button type="submit" className="w-full" size="lg" data-event="submit_demo_form" disabled={isSubmitting}>
        {isSubmitting ? 'Generating roadmap…' : 'Generate roadmap'}
      </Button>
    </>
  );
}
