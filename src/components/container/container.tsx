import { Slot, component$ } from "@builder.io/qwik";

export interface ContainerProps {}

export const Container = component$<ContainerProps>(() => {
  return (
    <div class="w-screen h-screen flex justify-center items-center">
      <Slot name="content" />
    </div>
  );
});
