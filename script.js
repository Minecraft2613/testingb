
        const { useState, useEffect } = React;

        const EMPLOYEE_API_URL = 'https://bank-data.1987sakshamsingh.workers.dev/employee'; // New employee endpoints

        const App = () => {
            const [employeeUser, setEmployeeUser] = useState(null);
            const [loading, setLoading] = useState(false);
            const [message, setMessage] = useState('');

            const handleLogin = async (username, password) => {
                setLoading(true);
                setMessage(''); // Clear message on new login attempt
                try {
                    console.log("Attempting employee login with URL:", EMPLOYEE_API_URL);
                    const response = await fetch(EMPLOYEE_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'employee_login', username, password })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        setEmployeeUser(username);
                    } else {
                        setMessage(data.message || 'Login failed');
                    }
                } catch (e) {
                    setMessage('Connection error');
                } finally {
                    setLoading(false);
                }
            };

            const handleLogout = () => {
                setEmployeeUser(null);
                setMessage('Logged out successfully.');
            };

            if (loading) return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <div className="loader"></div>
                </div>
            );

            return employeeUser ? (
                <EmployeeDashboard employeeUser={employeeUser} handleLogout={handleLogout} />
            ) : (
                <EmployeeLogin onLogin={handleLogin} message={message} />
            );
        };

        const EmployeeLogin = ({ onLogin, message }) => {
            const [username, setUsername] = useState('');
            const [password, setPassword] = useState('');

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Employee Login</h2>
                        <form onSubmit={e => { e.preventDefault(); onLogin(username, password); }} className="space-y-4">
                            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md">Login</button>
                        </form>
                        {message && <p className="text-center text-red-400 mt-4">{message}</p>}
                    </div>
                </div>
            );
        };

        const EmployeeDashboard = ({ employeeUser, handleLogout }) => {
            const [loans, setLoans] = useState([]);
            const [loadingLoans, setLoadingLoans] = useState(true);
            const [selectedLoan, setSelectedLoan] = useState(null);
            const [visitTime, setVisitTime] = useState('');
            const [employeeMessage, setEmployeeMessage] = useState('');
            const [modalMessage, setModalMessage] = useState('');
            const [showAdditionalFields, setShowAdditionalFields] = useState(false);
            const [loanerPhoto, setLoanerPhoto] = useState(null); // Changed to null for file object
            const [landPhoto, setLandPhoto] = useState(null);
            const [buildingPhoto, setBuildingPhoto] = useState(null);
            const [employeePhoto, setEmployeePhoto] = useState(null);
            const [signatureOfBankEmployee, setSignatureOfBankEmployee] = useState(null);
            const [loanerBankId, setLoanerBankId] = useState('');
            const [loanerPerDayIncome, setLoanerPerDayIncome] = useState('');
            const [hasBusiness, setHasBusiness] = useState(false);
            const [areaVolume, setAreaVolume] = useState('');
            const [cornerCoords, setCornerCoords] = useState('');
            const [valueOfLand, setValueOfLand] = useState('');
            const [valueOfBuilding, setValueOfBuilding] = useState('');
            const [loanerNetWorth, setLoanerNetWorth] = useState('');
            const [visitTimeSet, setVisitTimeSet] = useState(false);
            const [messageSet, setMessageSet] = useState(false);
            const [sendingLoan, setSendingLoan] = useState(false);

            const fetchLoans = async () => {
                setLoadingLoans(true);
                try {
                    console.log("Fetching loans for employee:", employeeUser);
                    const response = await fetch(EMPLOYEE_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'get_loans', employeeUser })
                    });
                    console.log("Fetch loans response status:", response.status);
                    const data = await response.json();
                    console.log("Fetch loans response data:", data);
                    if (data.success) {
                        setLoans(data.loans);
                    } else {
                        setModalMessage(data.message || 'Failed to fetch loans.');
                    }
                } catch (e) {
                    setModalMessage('Connection error while fetching loans.');
                    console.error("Error fetching loans:", e);
                } finally {
                    setLoadingLoans(false);
                }
            };

            useEffect(() => {
                if (employeeUser) {
                    fetchLoans();
                    const interval = setInterval(fetchLoans, 10000); // Refresh every 10 seconds
                    return () => clearInterval(interval);
                }
            }, [employeeUser]);

            useEffect(() => {
                if (selectedLoan) {
                    setVisitTime(selectedLoan.employeeVisitTime || '');
                    setEmployeeMessage(selectedLoan.employeeMessage || '');
                    setVisitTimeSet(!!selectedLoan.employeeVisitTime);
                    setMessageSet(!!selectedLoan.employeeMessage);
                    setShowAdditionalFields(false); // Reset additional fields view
                    setLoanerPhoto(null);
                    setLandPhoto(null);
                    setBuildingPhoto(null);
                    setEmployeePhoto(null);
                    setSignatureOfBankEmployee(null);
                    setLoanerBankId(selectedLoan.loanerBankId || '');
                    setLoanerPerDayIncome(selectedLoan.loanerPerDayIncome || '');
                    setHasBusiness(selectedLoan.hasBusiness || false);
                    setAreaVolume(selectedLoan.areaVolume || '');
                    setCornerCoords(selectedLoan.cornerCoords || '');
                    setValueOfLand(selectedLoan.valueOfLand || '');
                    setValueOfBuilding(selectedLoan.valueOfBuilding || '');
                    setLoanerNetWorth(selectedLoan.loanerNetWorth || '');
                }
            }, [selectedLoan]);

            const handleSetVisitTime = async () => {
                if (!selectedLoan || !visitTime) {
                    setModalMessage('Please select a loan and set a visit time.');
                    return;
                }
                try {
                    const response = await fetch(EMPLOYEE_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'set_visit_time',
                            loanId: selectedLoan.id,
                            employeeVisitTime: visitTime,
                            employeeUser
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setModalMessage('Visit time set successfully!');
                        setVisitTimeSet(true);
                        // Update the selected loan in the local state
                        setLoans(prevLoans => prevLoans.map(loan =>
                            loan.id === selectedLoan.id ? { ...loan, employeeVisitTime: visitTime, loanStatus: 'waitingForEmployeeApproval' } : loan
                        ));
                        setSelectedLoan(prevLoan => ({ ...prevLoan, employeeVisitTime: visitTime, loanStatus: 'waitingForEmployeeApproval' }));
                    } else {
                        setModalMessage(data.message || 'Failed to set visit time.');
                    }
                } catch (e) {
                    setModalMessage('Connection error while setting visit time.');
                    console.error("Error setting visit time:", e);
                }
            };

            const handleAddMessage = async () => {
                if (!selectedLoan || !employeeMessage) {
                    setModalMessage('Please select a loan and add a message.');
                    return;
                }
                try {
                    const response = await fetch(EMPLOYEE_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'add_message',
                            loanId: selectedLoan.id,
                            employeeMessage,
                            employeeUser
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setModalMessage('Message added successfully!');
                        setMessageSet(true);
                        // Update the selected loan in the local state
                        setLoans(prevLoans => prevLoans.map(loan =>
                            loan.id === selectedLoan.id ? { ...loan, employeeMessage: employeeMessage } : loan
                        ));
                        setSelectedLoan(prevLoan => ({ ...prevLoan, employeeMessage: employeeMessage }));
                    } else {
                        setModalMessage(data.message || 'Failed to add message.');
                    }
                } catch (e) {
                    setModalMessage('Connection error while adding message.');
                    console.error("Error adding message:", e);
                }
            };

            const areAdditionalFieldsFilled = () => {
                // Check if all required fields are filled
                return (
                    loanerPhoto &&
                    landPhoto &&
                    buildingPhoto &&
                    employeePhoto &&
                    signatureOfBankEmployee &&
                    loanerBankId &&
                    loanerPerDayIncome &&
                    areaVolume &&
                    cornerCoords &&
                    valueOfLand &&
                    valueOfBuilding &&
                    loanerNetWorth
                );
            };

            const handlePassLoan = async () => {
                if (!selectedLoan) {
                    setModalMessage('Please select a loan to pass.');
                    return;
                }
                if (!areAdditionalFieldsFilled()) {
                    setModalMessage('Please fill all additional loan details before sending.');
                    return;
                }

                setSendingLoan(true);
                try {
                    const response = await fetch(EMPLOYEE_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'pass_loan',
                            loanId: selectedLoan.id,
                            userAccountId: selectedLoan.accountId,
                            employeeUser,
                            employeeVisitTime: selectedLoan.employeeVisitTime, // Include employeeVisitTime
                            employeeMessage: selectedLoan.employeeMessage, // Include employeeMessage
                            loanerPhoto: loanerPhoto ? loanerPhoto.name : null, // Sending file name as placeholder URL
                            landPhoto: landPhoto ? landPhoto.name : null,
                            buildingPhoto: buildingPhoto ? buildingPhoto.name : null,
                            employeePhoto: employeePhoto ? employeePhoto.name : null,
                            signatureOfBankEmployee: signatureOfBankEmployee ? signatureOfBankEmployee.name : null,
                            loanerBankId,
                            loanerPerDayIncome: parseFloat(loanerPerDayIncome),
                            hasBusiness,
                            areaVolume,
                            cornerCoords,
                            valueOfLand: parseFloat(valueOfLand),
                            valueOfBuilding: parseFloat(valueOfBuilding),
                            loanerNetWorth: parseFloat(loanerNetWorth)
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setModalMessage('Loan sent for Admin Approval successfully!');
                        fetchLoans(); // Refresh the loan list
                        setSelectedLoan(null); // Clear selected loan
                    } else {
                        setModalMessage(data.message || 'Failed to send loan for approval.');
                    }
                } catch (e) {
                    setModalMessage('Connection error while sending loan for approval.');
                    console.error("Error passing loan:", e);
                } finally {
                    setSendingLoan(false);
                }
            };





            return (
                <div className="min-h-screen flex flex-col bg-gray-800 p-6">
                    {sendingLoan && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                            <div className="loader"></div>
                            <p className="text-white ml-4 text-lg">Sending for Admin Approval...</p>
                        </div>
                    )}
                    <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                        <h1 className="text-4xl font-bold text-blue-400">Employee Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-xl">Welcome, {employeeUser}!</span>
                            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Logout</button>
                        </div>
                    </header>

                    {modalMessage && (
                        <div className="bg-blue-500 text-white p-3 rounded-md mb-4 text-center">
                            {modalMessage}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-blue-300 mb-4">Loans for Review</h2>
                            {loadingLoans ? (
                                <div className="flex justify-center items-center h-32"><div className="loader"></div></div>
                            ) : loans.length > 0 ? (
                                <ul className="space-y-3">
                                    {loans.map(loan => (
                                        <li key={loan.id} 
                                            className={`p-4 rounded-md cursor-pointer ${selectedLoan?.id === loan.id ? 'bg-blue-700' : 'bg-gray-700'} hover:bg-gray-600`}
                                            onClick={() => setSelectedLoan(loan)}>
                                            <p className="font-semibold">{loan.loanType} Loan for {loan.accountId}</p>
                                            <p className="text-sm text-gray-400">Amount: ${parseFloat(loan.loanAmount)?.toFixed(2) || '0.00'} | Status: {loan.loanStatus === 'approved' ? 'Active Loan' : loan.loanStatus === 'rejected' ? 'Rejected' : loan.loanStatus}</p>
                                            {loan.employeeVisitTime && <p className="text-sm text-gray-400">Visit: {new Date(loan.employeeVisitTime).toLocaleString()}</p>}
                                            {loan.employeeMessage && <p className="text-sm text-gray-400">Message: {loan.employeeMessage}</p>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No loans currently awaiting employee review.</p>
                            )}
                        </div>

                        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-blue-300 mb-4">Loan Details & Actions</h2>
                            {selectedLoan ? (
                                <div className="space-y-4">
                                    <p><strong>Loan ID:</strong> {selectedLoan.id}</p>
                                    <p><strong>Loaner:</strong> {selectedLoan.accountId}</p>
                                    <p><strong>Amount:</strong> ${parseFloat(selectedLoan.loanAmount)?.toFixed(2) || '0.00'}</p>
                                    <p><strong>Status:</strong> {selectedLoan.loanStatus}</p>
                                    <p><strong>Purpose:</strong> {selectedLoan.purpose}</p>
                                    {selectedLoan.coord1 && <p><strong>Coords 1:</strong> {selectedLoan.coord1}</p>}
                                    {selectedLoan.coord2 && <p><strong>Coords 2:</strong> {selectedLoan.coord2}</p>}
                                    {selectedLoan.loanerPhoto && <p><strong>Loaner Photo:</strong> <a href={selectedLoan.loanerPhoto} target="_blank" className="text-blue-400 hover:underline">View</a></p>}
                                    {selectedLoan.landPhoto && <p><strong>Land Photo:</strong> <a href={selectedLoan.landPhoto} target="_blank" className="text-blue-400 hover:underline">View</a></p>}
                                    {selectedLoan.buildingPhoto && <p><strong>Building Photo:</strong> <a href={selectedLoan.buildingPhoto} target="_blank" className="text-blue-400 hover:underline">View</a></p>}
                                    {selectedLoan.employeePhoto && <p><strong>Employee Photo:</strong> <a href={selectedLoan.employeePhoto} target="_blank" className="text-blue-400 hover:underline">View</a></p>}
                                    {selectedLoan.signatureOfBankEmployee && <p><strong>Signature:</strong> <a href={selectedLoan.signatureOfBankEmployee} target="_blank" className="text-blue-400 hover:underline">View</a></p>}
                                    
                                    <hr className="border-gray-700" />

                                    <h3 className="text-xl font-bold text-blue-300 mb-2">Employee Actions</h3>
                                    <div className="space-y-3">
                                        {selectedLoan.employeeVisitTime && <p className="text-sm text-gray-400">Note: Visit Time Set: {new Date(selectedLoan.employeeVisitTime).toLocaleString()}</p>}
                                        {selectedLoan.employeeMessage && <p className="text-sm text-gray-400">Note: Employee Message Added: {selectedLoan.employeeMessage}</p>}
                                        {!selectedLoan.employeeVisitTime && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300">Set Visit Time:</label>
                                                <div className="flex space-x-2">
                                                    <input type="datetime-local" value={visitTime} onChange={e => setVisitTime(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                    <button onClick={() => setVisitTime(new Date().toISOString().slice(0, 16))} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">Today</button>
                                                </div>
                                                <button onClick={handleSetVisitTime} className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">Set Time</button>
                                            </div>
                                        )}
                                        {!selectedLoan.employeeMessage && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300">Add Message:</label>
                                                <textarea value={employeeMessage} onChange={e => setEmployeeMessage(e.target.value)} rows="3" className="w-full p-2 bg-gray-700 rounded-md border border-gray-600"></textarea>
                                                <button onClick={handleAddMessage} className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md">Add Message</button>
                                            </div>
                                        )}
                                        {(selectedLoan.employeeVisitTime && selectedLoan.employeeMessage && !showAdditionalFields) && (
                                            <button onClick={() => setShowAdditionalFields(true)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md">Next</button>
                                        )}
                                        {showAdditionalFields && (
                                            <div className="space-y-3 mt-3">
                                                <h3 className="text-xl font-bold text-blue-300 mb-2">Additional Loan Details</h3>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Loaner Photo:</label>
                                                    <input type="file" onChange={e => setLoanerPhoto(e.target.files[0])} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                    {loanerPhoto && <p className="text-sm text-gray-400">Selected: {loanerPhoto.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Land Photo:</label>
                                                    <input type="file" onChange={e => setLandPhoto(e.target.files[0])} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                    {landPhoto && <p className="text-sm text-gray-400">Selected: {landPhoto.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Building Photo:</label>
                                                    <input type="file" onChange={e => setBuildingPhoto(e.target.files[0])} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                    {buildingPhoto && <p className="text-sm text-gray-400">Selected: {buildingPhoto.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Employee Photo:</label>
                                                    <input type="file" onChange={e => setEmployeePhoto(e.target.files[0])} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                    {employeePhoto && <p className="text-sm text-gray-400">Selected: {employeePhoto.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Signature of Bank Employee:</label>
                                                    <input type="file" onChange={e => setSignatureOfBankEmployee(e.target.files[0])} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                    {signatureOfBankEmployee && <p className="text-sm text-gray-400">Selected: {signatureOfBankEmployee.name}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Loaner Bank ID:</label>
                                                    <input type="text" value={loanerBankId} onChange={e => setLoanerBankId(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Loaner Per Day Income:</label>
                                                    <input type="number" value={loanerPerDayIncome} onChange={e => setLoanerPerDayIncome(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                </div>
                                                <div className="flex items-center">
                                                    <input type="checkbox" checked={hasBusiness} onChange={e => setHasBusiness(e.target.checked)} className="mr-2" />
                                                    <label className="text-sm font-medium text-gray-300">Has Business</label>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Area/Volume:</label>
                                                    <input type="text" value={areaVolume} onChange={e => setAreaVolume(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Corner Coords:</label>
                                                    <input type="text" value={cornerCoords} onChange={e => setCornerCoords(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Value of Land:</label>
                                                    <input type="number" value={valueOfLand} onChange={e => setValueOfLand(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Value of Building:</label>
                                                    <input type="number" value={valueOfBuilding} onChange={e => setValueOfBuilding(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-300">Loaner Net Worth:</label>
                                                    <input type="number" value={loanerNetWorth} onChange={e => setLoanerNetWorth(e.target.value)} className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                                </div>
                                                <button onClick={handlePassLoan} disabled={sendingLoan || !areAdditionalFieldsFilled()} className={`w-full font-bold py-3 rounded-md ${sendingLoan || !areAdditionalFieldsFilled() ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                                    {sendingLoan ? 'Sending...' : 'Send'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p>Select a loan from the left to view details and perform actions.</p>
                            )}
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-blue-300 mb-4">Tax Calculator</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Player Name:</label>
                                    <input type="text" id="tax-player-name" className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Amount:</label>
                                    <input type="number" id="tax-amount" className="w-full p-2 bg-gray-700 rounded-md border border-gray-600" />
                                </div>
                                <button onClick={() => {
                                    const player = document.getElementById('tax-player-name').value;
                                    const amount = document.getElementById('tax-amount').value;
                                    if (!player || !amount) {
                                        setModalMessage('Please enter a player name and amount.');
                                        return;
                                    }
                                    const tax = parseFloat(amount) * 0.1; // Assuming a 10% tax rate
                                    setModalMessage(`Tax for ${player} is ${tax?.toFixed(2) || '0.00'}`);
                                }} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md">Calculate Tax</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
