import styled from "styled-components";
import { useSession, signIn, signOut } from "next-auth/react";
import { useI18n } from "@/lib/use-i18n";

export default function AuthButtons() {
  const { data: session } = useSession();
  const { translate } = useI18n();

  if (session) {
    return (
      <>
        <ButtonAuth onClick={() => signOut()}>{translate("auth.signOut")}</ButtonAuth>
      </>
    );
  }
  return (
    <>
      {translate("auth.notSignedIn")} <br />
      <button onClick={() => signIn()}>{translate("auth.signIn")}</button>
    </>
  );
}

const ButtonAuth = styled.button`
  color: var(--foreground);
  margin: 5px;
  padding: 12px 11px;
`;
