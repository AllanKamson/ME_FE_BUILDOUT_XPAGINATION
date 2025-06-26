import React, { useState, useEffect } from 'react';
// import "./App.css";

const AppStyles = () => (
    <style>
        {`
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
        }
        .container {
            max-width: 960px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 25px;
            font-size: 24px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background-color:#fff;
        }
        tbody {
            background-color: #fff;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
        }
        th {
            background-color: #019879;
            color: white;
            text-transform: uppercase;
        }
        tbody tr:nth-child(odd) {
            background-color: #fcfcfc;
        }
        tbody tr:nth-child(even) {
            // background-color: #e8e8e8;
        }
        .pagination-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 30px;
            padding-bottom: 20px;
        }
        .pagination-button {
            padding: 10px 15px;
            margin: 0 5px;
            border: none;
            border-radius: 2px;
            background-color: #019879;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }
        .pagination-button:disabled {
            background-color: #019879;
        }
        .pagination-button:hover:not(:disabled) {
            background-color: #007a60;
        }
        .current-page-indicator {
            padding: 10px 15px;
            margin: 0 5px;
            background-color: #019879;
            color: white;
            font-weight: bold;
            font-size: 14px;
            border-radius: 2px;
        }
        /* Responsive */
        @media (max-width: 600px) {
            th, td {
                padding: 8px 10px;
                font-size: 12px;
            }
            .pagination-button, .current-page-indicator {
                padding: 8px 12px;
                font-size: 12px;
            }
        }
        `}
    </style>
);

export default function App() {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const rowsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEmployees(data);
            } catch (error) {
                alert('failed to fetch data');
                setError('failed to fetch data');
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil(employees.length / rowsPerPage);
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = employees.slice(indexOfFirstRow, indexOfLastRow);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: 'Inter, sans-serif'
            }}>
                Loading...
            </div>
        );
    }

    if (error) {
         return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                color: 'red',
                fontFamily: 'Inter, sans-serif'
            }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{
            fontFamily: 'Inter, sans-serif',
            minHeight: '100vh',
            padding: '20px',
            boxSizing: 'border-box',
            backgroundColor: '#f0f0f0'
        }}>
            <AppStyles />

            <div className="container">
                <h1>Employee Data Table</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.name}</td>
                                <td>{employee.email}</td>
                                <td style={{textTransform: 'capitalize'}}>{employee.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-container">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Previous
                    </button>
                    <span className="current-page-indicator">
                        {currentPage}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}