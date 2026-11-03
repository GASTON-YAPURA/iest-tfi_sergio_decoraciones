import { revalidatePath } from "next/cache";

export function revalidarTrabajosPublicos() {
  revalidatePath("/");
  revalidatePath("/trabajos");
}
