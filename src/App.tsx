import './index.css';
import LandingPage from './pages/landingPage';
import {
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";
import ErrorPage from './pages/errorPage';
import GetStarted from './pages/get-started-page';
import Layout from './layout/Layout';
import Dashboard from './pages/dashboard';
import Account from './pages/account';
import Expense from './pages/expense';
import Income from './pages/income';
import Budget from './pages/budget';
import Billing from './pages/billing';
import ProtectedRoute from './auth/protectedRoute';
import { ResetPassword } from './pages/forgotPassword';

const userSessionString = localStorage.getItem("userSession") || sessionStorage.getItem("userSession");

let userSession;
// Check if the user session exists
if (userSessionString) {
  try {
    // Parse the JSON string into an object
    userSession = JSON.parse(userSessionString);
    
    // Now you can work with the userSession object
    console.log(userSession);

    // For example, accessing user data:
    console.log(userSession.data);
    console.log(userSession.data.fullName);
  } catch (error) {
    console.error("Failed to parse user session:", error);
  }
} else {
  console.log("No user session found in local storage.");
}



const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/get-started",
    element: <GetStarted />
  },
  {
    path: "/forgotpassword/:token",
    element: <ResetPassword />
  },
  {
    path: '/dashboard/:id',
    element: <Layout>
      <Dashboard />
    </Layout>
  },
  {
    path: '/dashboard/:id/account',
    element: <Layout>
      <ProtectedRoute>
      <Account />
      </ProtectedRoute>
    </Layout>
  },
  {
    path: '/dashboard/:id/expense',
    element: <Layout>
      <ProtectedRoute>
      <Expense />
      </ProtectedRoute>
    </Layout>
  },
  {
    path: '/dashboard/:id/income',
    element: <Layout>
      <ProtectedRoute>
      <Income />
      </ProtectedRoute>
    </Layout>
  },
  {
    path: `/dashboard/:id/budgets`,
    element: <Layout>
      <ProtectedRoute>
      <Budget />
      </ProtectedRoute>
    </Layout>
  },
  // {
  //   path: `/dashboard/:userId/expense/:id`,
  //   element: <Layout>
  //     <ProtectedRoute>
  //     <ExpensePage />
  //     </ProtectedRoute>
  //   </Layout>
  // },
  // {
  //   path: `/dashboard/:userId/budget/:id`,
  //   element: <Layout>
  //     <ProtectedRoute>
  //     <BudgetPage />
  //     </ProtectedRoute>
  //   </Layout>
  // },
  // {
  //   path: `/dashboard/:userId/income/:id`,
  //   element: <Layout>
  //     <ProtectedRoute>
  //     <IncomePage />
  //     </ProtectedRoute>
  //   </Layout>
  // },
  {
    path: `/dashboard/:id/upgrade`,
    element: <Layout>
      <ProtectedRoute>
      <Billing />
      </ProtectedRoute>
    </Layout>
  }

])

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
