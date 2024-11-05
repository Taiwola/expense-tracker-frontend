import { fetchExpense } from '@/api/expense/route';
import { Expense } from '@/types/types';
import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ExpensePage = () => {
  const { id } = useParams();
  const [expense, setExpense] = useState<Expense>();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpensed = async () => {
      try {
        const expenseId = id as string;
        const data = await fetchExpense(expenseId);
        setExpense(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    fetchExpensed();
  }, [id]);

  console.log(expense);

  if (error) return <p className="text-red-500 text-center mt-4">{`Error: ${error}`}</p>;
  if (!expense) return <p className="text-gray-500 text-center mt-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Expense Details</h1>
      <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Description</h2>
          <p className="text-gray-600 text-sm">{expense.description || 'No description provided'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Amount</h2>
          <p className="text-gray-700 text-lg font-medium">${expense.amount.toFixed(2)}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Category</h2>
          <p className="text-gray-600 text-sm">{expense.category?.description || 'No category assigned'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Budget</h2>
          <p className="text-gray-600 text-sm">{expense.budget?.amount ? `$${expense.budget.amount.toFixed(2)}` : 'No budget assigned'}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Created At</h2>
          <p className="text-gray-600 text-sm">{new Date(expense.createdAt).toLocaleDateString()}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">Updated At</h2>
          <p className="text-gray-600 text-sm">{new Date(expense.updatedAt).toLocaleDateString()}</p>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <Link to={`/expenses/${id}/edit`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-300">
              Edit Expense
            </button>
          </Link>
          <Link to="/expenses">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg transition duration-300">
              Back to Expenses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
