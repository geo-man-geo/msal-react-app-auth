import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "./auth-config";
import "./App.css";

const WrappedView = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const handleRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        promt: "create",
      })
      .catch((error) => console.log(error));
  };

  const accounts = instance.getAllAccounts();

  function signOutClickHandler(instance, accountToSignOut) {
    const logoutRequest = {
       account: accountToSignOut,
       mainWindowRedirectUri: "/",
       postLogoutRedirectUri: "/"
     }
     instance.logoutPopup(logoutRequest);
    }
   
  // Function to find the AccountInfo based on homeAccountId
  const findAccountByHomeAccountId = (homeAccountId) => {
    return accounts.find((account) => account.homeAccountId === homeAccountId);
  };

  const logOut = () => {
    const homeAccountId = accounts[0].homeAccountId;
    const accountToSignOut = findAccountByHomeAccountId(homeAccountId);
    if (accountToSignOut) {
      signOutClickHandler(instance, accountToSignOut);
    } else {
      console.error("Account not found for the given homeAccountId");
    }
  };
  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount ? (
          <div>
            <p>This is a sample BOB webapp authenticated using MSAL</p>{" "}
            <button onClick={logOut}>Log Out</button>
          </div>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <button onClick={handleRedirect}>Sign Up</button>
      </UnauthenticatedTemplate>
    </div>
  );
};

const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <WrappedView />
    </MsalProvider>
  );
};

export default App;
