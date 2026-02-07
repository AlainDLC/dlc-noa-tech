import { Suspense } from "react";
import RegisterSchool from "./RegisterSchool";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterSchool />
    </Suspense>
  );
}
