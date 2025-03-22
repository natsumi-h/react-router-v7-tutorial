import type { Route } from "./+types/edit-contact";
import { Form, redirect, useActionData, useNavigate } from "react-router";
import { getContact, updateContact } from "../data";
import {
  useForm,
  getFormProps,
  getInputProps,
  getTextareaProps,
} from "@conform-to/react";
import { parseWithZod, getZodConstraint } from "@conform-to/zod";
import { z } from "zod";

const schema = z.object({
  first: z.string().min(1, "First name is required"),
  last: z.string().min(1, "Last name is required"),
  twitter: z.string().min(1, "Twitter is required"),
  avatar: z.string().min(1, "Avatar is required"),
  notes: z.string().min(1, "Notes are required"),
});

export async function loader({ params }: Route.LoaderArgs) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return { contact };
}

export async function action({ params, request }: Route.ActionArgs) {
  // Formデータオブジェクトを取得
  const formData = await request.formData();
  // バリデーション（ConformのparseWithZodにformDataとschemaを渡す）
  const submission = parseWithZod(formData, { schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  // return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  const navigate = useNavigate();

  // ここでactionの返り値を受け取れる
  const lastResult = useActionData<typeof action>();
  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    id: "contact-form",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  console.log({ ...getFormProps(form) });
  console.log("onSubmit", form.onSubmit);
  console.log("lastResult", lastResult);
  console.log("fields", { ...getInputProps(fields.first, { type: "text" }) });

  return (
    <>
      <Form
        key={contact.id}
        // id="contact-form"
        method="post"
        {...getFormProps(form)}
      >
        <p>
          <span>Name</span>
          <input
            aria-label="First name"
            defaultValue={contact.first}
            // name="first"
            placeholder="First"
            // type="text"
            {...getInputProps(fields.first, { type: "text" })}
          />
          <input
            aria-label="Last name"
            defaultValue={contact.last}
            // name="last"
            placeholder="Last"
            // type="text"
            {...getInputProps(fields.last, { type: "text" })}
          />
        </p>

        <label>
          <span>Twitter</span>
          <input
            defaultValue={contact.twitter}
            // name="twitter"
            placeholder="@jack"
            // type="text"
            {...getInputProps(fields.twitter, { type: "text" })}
          />
        </label>
        <label>
          <span>Avatar URL</span>
          <input
            aria-label="Avatar URL"
            defaultValue={contact.avatar}
            // name="avatar"
            placeholder="https://example.com/avatar.jpg"
            // type="text"
            {...getInputProps(fields.avatar, { type: "text" })}
          />
        </label>
        <label>
          <span>Notes</span>
          <textarea
            defaultValue={contact.notes}
            // name="notes"
            rows={6}
            {...getTextareaProps(fields.notes)}
          />
        </label>
        <p>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </p>
      </Form>

      {/* エラーメッセージ */}
      <div style={{ color: "red" }}>
        <p>
          {fields?.first?.errors ? `First Name: ${fields?.first?.errors}` : ""}
          {/* {lastResult?.error?.first
            ? `First Name: ${lastResult?.error?.first}`
            : ""} */}
        </p>
        <p>
          {fields?.last?.errors ? `Last Name: ${fields?.last?.errors}` : ""}
        </p>
        <p>
          {fields?.twitter?.errors ? `Twitter: ${fields?.twitter?.errors}` : ""}
        </p>
        <p>
          {fields?.avatar?.errors ? `Avatar: ${fields?.avatar?.errors}` : ""}
        </p>
        <p>{fields?.notes?.errors ? `Notes: ${fields?.notes?.errors}` : ""}</p>
      </div>
    </>
  );
}
