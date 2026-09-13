"use client";

import { startTransition, useActionState, useState } from "react";

/**
 * useActionState, dispatched from onSubmit instead of `<form action>`.
 *
 * React 19 calls requestFormReset() on the form before running every function
 * action — see startHostTransition in react-dom — so all uncontrolled fields
 * are cleared once the action settles. That includes actions that return a
 * validation error: an author told "Give the post a title" would find the
 * excerpt, slug and SEO fields wiped along with it. Dispatching by hand inside
 * a transition keeps the pending flag and the returned state, without the
 * reset. Forms that should clear after a success remount with a `key` instead —
 * see useSuccessCount.
 */
export function useFormSubmit<State>(
  // Mirrors useActionState's own signature, which types the state as
  // Awaited<State> so an async action's resolved value is what's stored.
  action: (state: Awaited<State>, formData: FormData) => State | Promise<State>,
  initialState: Awaited<State>,
) {
  const [state, dispatch, pending] = useActionState(action, initialState);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Include the clicked button's name and value (publish=true, for one),
    // exactly as a native submission would.
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const formData = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(formData));
  };

  return [state, onSubmit, pending] as const;
}

/**
 * Counts successful submissions, for use as a form's `key` so it clears after
 * each success and never after an error. Adjusts state during render when the
 * action result changes — React's documented alternative to doing it in an
 * effect, which would render the stale form once first.
 */
export function useSuccessCount<State>(
  state: State,
  /** How this form's state says "it worked". Defaults to a `success` message. */
  succeeded: (state: State) => boolean = (value) =>
    Boolean((value as { success?: unknown }).success),
) {
  const [count, setCount] = useState(0);
  const [seen, setSeen] = useState(state);

  if (state !== seen) {
    setSeen(state);
    if (succeeded(state)) setCount((n) => n + 1);
  }

  return count;
}
