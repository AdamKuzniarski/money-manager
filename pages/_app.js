import GlobalStyle from "@/styles";
import { SWRConfig } from "swr";
import { StyledToastContainer } from "@/components/ToastContainer";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider, useSession } from "next-auth/react";
import { Layout } from "@/components/ui/Primitives";
import BottomNav from "@/components/BottomNav";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { maybeStartTour } from "@/tour/TourManager";
import { appWithTranslation, useTranslation } from "next-i18next";

const nextI18nextConfig = require("../next-i18next.config");
function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { t: translate, i18n } = useTranslation("common");
  
  useEffect(() => {
    maybeStartTour(translate);
  }, [i18n.resolvedLanguage, translate]);
  return (
    <SWRConfig
      value={{
        fetcher: async (...args) => {
          const response = await fetch(...args);
          if (!response.ok) {
            throw new Error(`Request with ${JSON.stringify(args)} failed.`);
          }
          return await response.json();
        },
      }}
    >
      <SessionProvider session={session}>
        <GlobalStyle />
        <StyledToastContainer />
        <Auth>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <BottomNav />
        </Auth>
      </SessionProvider>
    </SWRConfig>
  );
}

function Auth({ children }) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return children;
}
export default appWithTranslation(App, nextI18nextConfig);