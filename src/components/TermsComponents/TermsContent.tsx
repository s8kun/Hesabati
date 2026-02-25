import Snowfall from "react-snowfall";
import TermsDescription from "./TermsDescription";

export default function TermsContent() {
  return (
    <div>
      <Snowfall
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
        }}
        snowflakeCount={100}
      />
      <TermsDescription />
    </div>
  );
}
