const API_BASE_URL = "http://localhost:3000";
const token = sessionStorage.getItem("token");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// Helper function to handle responses
const handleResponse = async (res: any) => {
  if (!res.ok) {
    const response = await res.json().catch(() => ({}));
    throw new Error(response.message || 'An error occurred');
  }
  return await res.json();
};


export const exportPdf = async () => {
    const token = sessionStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/api/reports/export-pdf`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    if (!res.ok) {
        const response = await res.json().catch(() => ({}));
        throw new Error(response.message || 'Failed to download the report');
    }

    // Get the response as a blob
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf"; // Set a default filename
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    URL.revokeObjectURL(url);
};

export const checkBudgetAlerts = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reports/budget-alerts`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };
  

  export const generateCustomReport = async (startDate:any, endDate:any) => {
    const res = await fetch(`${API_BASE_URL}/api/reports/custom-report`, {
      method: "POST",
      headers,
      body: JSON.stringify({ startDate, endDate }),
    });
    return await handleResponse(res);
  };

  
  export const forecastExpenses = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reports/forecast-expenses`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };

  
  export const getAnnualBudgetPlanning = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reports/annual-budget`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };

  
  export const getCategoryWiseBreakdown = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reports/category-breakdown`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };

  
  export const getMonthlyTrends = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reports/monthly-trends`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };

  
  export const getTotalAmountForTheMonth = async (year:any, month:any) => {
    const res = await fetch(`${API_BASE_URL}/api/reports?year=${year}&month=${month}`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };
  
  export const getExpensePercentageByCategory = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reports/expense_percentage`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };

  
  export const getAllTotal = async () => {
    const res = await fetch(`${API_BASE_URL}/api/reports/total`, {
      method: "GET",
      headers,
    });
    return await handleResponse(res);
  };
  

// const handleDownloadPDF = async () => {
//     try {
//       const response = await fetch(`/api/export-pdf/${userId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/pdf",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to generate PDF");
//       }

//       // Create a Blob from the response
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
      
//       // Create a link to download the PDF
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "user-data.pdf"); // Specify the file name
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//     }
//   };