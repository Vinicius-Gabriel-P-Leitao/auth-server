import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../form.component";
import { Input } from "../../sh-input/input.component";
import { useForm } from "react-hook-form";

function TestForm() {
  const form = useForm({
    defaultValues: {
      test: "",
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="test"
        rules={{ required: "Required field" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Test Label</FormLabel>
            <FormControl>
              <Input placeholder="Test Input" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <button type="submit" onClick={form.handleSubmit(() => {})}>
        Submit
      </button>
    </Form>
  );
}

describe("Form", () => {
  it("renders form elements correctly", () => {
    render(<TestForm />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test Input")).toBeInTheDocument();
  });

  it("shows validation error message", async () => {
    render(<TestForm />);
    const submit = screen.getByText("Submit");

    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText("Required field")).toBeInTheDocument();
    });
  });
});
