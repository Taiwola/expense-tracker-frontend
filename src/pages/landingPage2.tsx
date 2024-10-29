import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="w-full py-4 bg-card text-card-foreground shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Expense Buddy</div>
          <ul className="flex space-x-8">
            <li><a href="#about" className="hover:text-primary">About</a></li>
            <li><a href="#features" className="hover:text-primary">Features</a></li>
            <li><a href="#contact" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Track Your Expenses Effortlessly</h1>
          <p className="text-lg mb-8">Manage your finances with ease, set budgets, and monitor your spending in real-time.</p>
          <a href="#about" className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-primary hover:text-primary-foreground">Learn More</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-background text-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">About Expense Buddy</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Expense Buddy is your ultimate tool to manage finances efficiently. From tracking daily expenses to analyzing spending patterns, Expense Buddy helps you stay in control of your budget.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-card text-card-foreground">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">App Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border rounded-lg shadow-sm bg-background text-foreground">
              <h3 className="text-2xl font-semibold mb-4">Track Your Spending</h3>
              <p>Record all your expenses and keep a close eye on where your money goes each day.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-background text-foreground">
              <h3 className="text-2xl font-semibold mb-4">Set Budgets</h3>
              <p>Create personalized budgets and get notifications when you’re close to your spending limits.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-background text-foreground">
              <h3 className="text-2xl font-semibold mb-4">Analyze Your Spending</h3>
              <p>View detailed reports and analytics to gain insights into your financial habits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-accent text-accent-foreground text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Start Managing Your Expenses Today</h2>
          <Link to="get-started" className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-secondary hover:text-secondary-foreground">Sign Up Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-8 bg-card text-card-foreground">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Expense Buddy. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-primary hover:text-primary-foreground">Privacy Policy</a>
            <a href="#" className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-primary hover:text-primary-foreground">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
