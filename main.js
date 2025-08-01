const { useState, useEffect, useMemo, useRef } = React; // Added a comment to trigger re-parse

        // --- CONFIGURATION (Cloudflare Worker URLs) ---
        const API_ENDPOINTS = {
            ACCOUNTS: 'https://bank-data.1987sakshamsingh.workers.dev',
            TAX: 'https://bank-data.1987sakshamsingh.workers.dev',
            CONTACT: 'https://bank-data.1987sakshamsingh.workers.dev/contact',
            BALANCES: 'https://bank-data.1987sakshamsingh.workers.dev/bal.json',
            SHOP_TRANSACTIONS: 'https://bank-data.1987sakshamsingh.workers.dev/shop-tran.json',
            JOB_TRANSACTIONS: 'https://bank-data.1987sakshamsingh.workers.dev/job-tran.json',
            LOANS: 'https://bank-data.1987sakshamsingh.workers.dev/loan.json',
            MESSAGES: 'https://bank-data.1987sakshamsingh.workers.dev/msg.json',
            TAX_PAYMENTS: 'https://bank-data.1987sakshamsingh.workers.dev/tax-pay.json',
        };

        // --- UTILITY & HELPER FUNCTIONS ---
        const copyToClipboard = (text, showModal) => {
            navigator.clipboard.writeText(text).then(() => showModal('Copied!', 'Bank ID copied to clipboard!', 'success'), () => showModal('Error', 'Failed to copy Bank ID.', 'error'));
        };

        // --- UI Components ---
        const Modal = ({ isOpen, title, message, onClose, type }) => {
            if (!isOpen) return null;
            const colors = { success: 'border-green-500', error: 'border-red-500', info: 'border-blue-500' };
            return (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                    <div className={`bg-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full border-t-4 ${colors[type] || colors.info}`}>
                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-gray-300 mb-6">{message}</p>
                        <div className="flex justify-end"><button onClick={onClose} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-200">Close</button></div>
                    </div>
                </div>
            );
        };

        const LoadingScreen = ({ loginSuccess, message }) => (
            <div className="loading-screen">
                {loginSuccess ?
                    <h1 className="text-4xl font-bold animate-fade-in">{message}</h1> :
                    <><div className="loading-container"><div className="giant-cube">{'cube-1,cube-2,cube-3,cube-4'.split(',').map(c => <div key={c} className={`cube ${c}`}><div className="face front"></div><div className="face back"></div><div className="face right"></div><div className="face left"></div><div className="face top"></div><div className="face bottom"></div></div>)}</div></div><h2 className="text-2xl font-bold mt-12 animate-pulse">{message}</h2></>
                }
            </div>
        );

        // --- Authentication Pages ---
        const AuthPageLayout = ({ children, title, footerText, footerButtonText, onFooterClick }) => (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
                <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md shadow-minecraft">
                    <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">{title}</h2>
                    {children}
                    <div className="text-center mt-6"><p className="text-gray-400">{footerText}</p><button onClick={onFooterClick} className="text-green-400 hover:underline font-semibold mt-1 focus:outline-none">{footerButtonText}</button></div>
                </div>
            );
        };

        const LoginPage = ({ setCurrentPage, handleLogin }) => {
            const [identifier, setIdentifier] = useState('');
            const [password, setPassword] = useState('');
            return (
                <AuthPageLayout title="Minecraft Bank Login 🏦" footerText="Don't have an account?" footerButtonText="Create one!" onFooterClick={() => setCurrentPage('create-account')}>
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(identifier, password); }} className="space-y-4">
                        <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Bank ID / MC Name / Email" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-200 shadow-md transform hover:scale-105">Login</button>
                    </form>
                </AuthPageLayout>
            );
        };

        const CreateAccountPage = ({ setCurrentPage, handleCreateAccount, showModal }) => {
            const [formState, setFormState] = useState({ bankName: '', accountId: '', email: '', password: '', edition: 'java' });
            const [generatedBankId, setGeneratedBankId] = useState('');
            useEffect(() => { setGeneratedBankId(`BANK${Math.floor(100000 + Math.random() * 900000)}`); }, []);
            const handleChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });
            const onSubmit = (e) => {
                e.preventDefault();
                const success = handleCreateAccount({ ...formState, bankId: generatedBankId });
                if (success) showModal('Account Created!', `Your Bank ID is: ${generatedBankId}. Please copy it and keep it safe!`, 'success', () => setCurrentPage('login'));
            };
            return (
                <AuthPageLayout title="Create Minecraft Bank Account 📝" footerText="Already have an account?" footerButtonText="Login here!" onFooterClick={() => setCurrentPage('login')}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <input name="bankName" value={formState.bankName} onChange={handleChange} placeholder="Bank Name" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <input name="email" type="email" value={formState.email} onChange={handleChange} placeholder="Email Address" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <select name="edition" value={formState.edition} onChange={handleChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"><option value="java">Java</option><option value="bedrock">Bedrock</option></select>
                        <div className="flex"><input name="accountId" value={formState.accountId} onChange={handleChange} placeholder="Your in-game name" required className={`w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 ${formState.edition === 'bedrock' ? 'rounded-l-none rounded-r-md' : 'rounded-md'}`} /></div>
                        <input name="password" type="password" value={formState.password} onChange={handleChange} placeholder="********" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                        {generatedBankId && <div className="p-3 bg-gray-700 rounded-md border border-green-500 flex items-center justify-between"><span className="text-green-300 text-sm font-mono break-all pr-2">Your Bank ID: <span className="font-bold text-lg">{generatedBankId}</span></span><button type="button" onClick={() => copyToClipboard(generatedBankId, showModal)} className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-md">Copy</button></div>}
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md">Create Account</button>
                    </form>
                </AuthPageLayout>
            );
        };

        // --- Main Application Layout ---
        const MainLayout = ({ children, currentUserAccount, setCurrentPage, handleLogout, notification }) => {
            const [isSidebarOpen, setIsSidebarOpen] = useState(false);
            return (
                <div className="flex min-h-screen bg-gray-800 text-gray-100">
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} setCurrentPage={setCurrentPage} handleLogout={handleLogout} notification={notification} />
                    <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
                        <TopBar setIsSidebarOpen={setIsSidebarOpen} currentUserAccount={currentUserAccount} />
                        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
                    </div>
                </div>
            );
        };

        const TopBar = ({ setIsSidebarOpen, currentUserAccount }) => (
            <div className="bg-gray-800 p-4 flex items-center justify-between shadow-lg sticky top-0 z-10 border-b-2 border-gray-700">
                <button onClick={() => setIsSidebarOpen(true)} className="text-green-400 text-3xl focus:outline-none p-2 rounded-md hover:bg-gray-700">☰</button>
                {currentUserAccount && <div className="flex items-center space-x-4"><span className="text-md font-semibold text-gray-200 hidden sm:block">{currentUserAccount.accountId}</span><div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-green-500 shadow-md">{currentUserAccount.accountId.charAt(0).toUpperCase()}</div></div>}
            </div>
        );

        const Sidebar = ({ isOpen, setIsOpen, setCurrentPage, handleLogout, notification }) => {
            const sidebarClass = isOpen ? 'translate-x-0' : '-translate-x-full';
            const navigateAndClose = (page) => { setCurrentPage(page); setIsOpen(false); };
            const menuItems = [
                { page: 'home', label: 'Home', icon: '🏠' }, { page: 'account-settings', label: 'Account Settings', icon: '⚙️' },
                { page: 'top-tax-payers', label: 'Top Tax Payers', icon: '🏆' }, { page: 'top-advance-tax-payers', label: 'Top Advance Tax Payers', icon: '🥇' },
                { page: 'contact-us', label: 'Contact Us', icon: '📞', notification: notification }, { page: 'theme-setting', label: 'Theme Settings', icon: '🎨' },
            ];
            return (
                <>
                    {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsOpen(false)}></div>}
                    <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 p-6 transform ${sidebarClass} transition-transform duration-300 ease-in-out shadow-xl z-30 flex flex-col border-r-4 border-gray-700`}>
                        <div className="flex justify-between items-center mb-10"><h2 className="text-2xl font-extrabold text-green-400">Menu</h2><button onClick={() => setIsOpen(false)} className="text-gray-400 text-3xl hover:text-white">&times;</button></div>
                        <nav className="flex-grow space-y-2">
                            {menuItems.map(item => <button key={item.page} onClick={() => navigateAndClose(item.page)} className="w-full text-left py-2.5 px-4 rounded-md text-md font-semibold text-gray-300 hover:bg-gray-700 hover:text-white transition duration-200 flex items-center gap-3">{item.icon} {item.label} {item.notification && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{item.notification}</span>}</button>)}
                        </nav>
                        <div className="mt-8"><button onClick={handleLogout} className="w-full text-left py-2.5 px-4 rounded-md text-md font-semibold text-gray-300 hover:bg-red-700 hover:text-white transition duration-200 flex items-center gap-3 bg-red-600">🚪 Logout</button></div>
                    </div>
                </>
            );
        };

        // --- Dashboard Pages ---
        const Dashboard = (props) => {
            const [activePage, setActivePage] = useState('bank-status');
            const renderActivePage = () => {
                switch (activePage) {
                    case 'bank-status': return <BankStatusPage {...props} />;
                    case 'tax-page': return <TaxPage {...props} />;
                    case 'apply-loan': return <ApplyLoanPage {...props} />;
                    default: return <BankStatusPage {...props} />;
                }
            };
            return (
                <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <TopNavButton title="Bank Status" icon="🏦" isActive={activePage === 'bank-status'} onClick={() => setActivePage('bank-status')} />
                        <TopNavButton title="View Tax" icon="🧾" isActive={activePage === 'tax-page'} onClick={() => setActivePage('tax-page')} />
                        <TopNavButton title="Apply for Loan" icon="💰" isActive={activePage === 'apply-loan'} onClick={() => setActivePage('apply-loan')} />
                    </div>
                    <div className="animate-fade-in">{renderActivePage()}</div>
                </div>
            );
        };

        const TopNavButton = ({ title, icon, isActive, onClick }) => (
            <button onClick={onClick} className={`flex-1 p-4 rounded-xl text-left transition-all duration-300 transform hover:-translate-y-1 shadow-minecraft hover:shadow-minecraft-lg ${isActive ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                <div className="text-3xl mb-2">{icon}</div><span className="text-lg font-semibold">{title}</span>
            </button>
        );


            const BankStatusPage = ({ currentUserAccount, handleCancelLoan, handleAdminApproveLoan, handlePayLoan }) => {
                const [selectedLoan, setSelectedLoan] = useState(null);
                if (!currentUserAccount) return null;

                const { bankName, loans = [], jobPerDayIncome = 0, businessPerDayIncome = 0, businessIncomeUnit = 'day', balance = 0, transactions = [] } = currentUserAccount;
const parsedBalance = parseFloat(balance);

                // Derive shopTransactions and jobTransactions from currentUserAccount.transactions
                const shopTransactions = transactions.filter(tx => tx.item !== undefined);
                const jobTransactions = transactions.filter(tx => tx.jobName !== undefined);

                const totalPerDayIncome = jobPerDayIncome + (businessIncomeUnit === 'hour' ? businessPerDayIncome * 8 : businessPerDayIncome);

                // Combine all transactions from currentUserAccount and sort them
                const allTransactions = [...transactions].sort((a, b) => new Date(b.date || b.timestamp).getTime() - new Date(a.date || a.timestamp).getTime());

                return (
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft">
                            <h2 className="text-xl font-bold text-green-400 mb-4">Account Overview</h2>
                            <p className="text-gray-300"><strong>Bank Name:</strong> {bankName}</p>
                            <p className="text-2xl font-bold">Balance: <span className="text-green-400">${parsedBalance?.toFixed(2) || '0.00'}</span></p>
                            <p className="text-2xl font-bold">Minecraft Balance: <span className="text-yellow-400">Coming Soon</span></p>
                            <p className="text-lg font-semibold mt-2">Total Income: <span className="text-yellow-400">${totalPerDayIncome}/day</span></p>
                            <p className="text-sm text-gray-400">Job: ${jobPerDayIncome}/day | Business: ${businessPerDayIncome}/{businessIncomeUnit}</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft">
                            <h2 className="text-xl font-bold text-green-400 mb-4">Loans ({loans.length})</h2>
                            {loans.length > 0 ? (
                                <ul className="space-y-4">
                                    {[...new Map(loans.map(item => [item['id'], item])).values()].map((loan) => {
                                        let statusText;
                                        let showCancelButton = false;
                                        let showPayButton = false;

                                        // Determine status text and button visibility based on loan.loanStatus
                                        if (loan.forcefullyApproved) {
                                            statusText = 'Forcefully Approved';
                                            showCancelButton = false; // Forcefully approved loans should not be cancellable by user
                                            showPayButton = true; // Assume forcefully approved means active and needs payment
                                        } else if (loan.loanStatus === 'approved') {
                                            statusText = 'Active Loan';
                                            showPayButton = true;
                                            showCancelButton = false; // Approved loans should not be cancellable by user
                                        } else if (loan.loanStatus === 'rejected') {
                                            statusText = 'Rejected';
                                            showCancelButton = false;
                                            showPayButton = false;
                                        } else if (loan.loanStatus === 'closed') {
                                            statusText = 'Closed';
                                            showCancelButton = false;
                                            showPayButton = false;
                                        } else if (loan.loanStatus === 'waitingForAdminApproval') {
                                            statusText = 'Waiting for Admin Approval';
                                            showCancelButton = true; // User can cancel while waiting for admin
                                            showPayButton = false;
                                        } else if (loan.loanStatus === 'pending' || loan.loanStatus === 'waitingForEmployeeApproval') {
                                            statusText = loan.loanStatus; // Display the exact status (e.g., 'pending')
                                            showCancelButton = true; // User can cancel while pending or waiting for employee
                                            showPayButton = false;
                                        } else { // Fallback for any other unexpected or undefined status
                                            statusText = loan.loanStatus || 'Unknown Status';
                                            showCancelButton = false; // Default to not showing cancel for unknown statuses
                                            showPayButton = false;
                                        }

                                        return (
                                            <li key={loan.id}
                                                className={`p-4 rounded-md cursor-pointer ${selectedLoan?.id === loan.id ? 'bg-blue-700' : 'bg-gray-700'} hover:bg-gray-600`}
                                                onClick={() => setSelectedLoan(loan)}>
                                                <div className="flex-grow">
                                                    <p className="font-bold capitalize text-yellow-400">{loan.loanType} Loan</p>
                                                    <p className="text-gray-300">Amount: ${parseFloat(loan.loanAmount)?.toFixed(2) || '0.00'} | Total Due: ${parseFloat(loan.loanAmountDue)?.toFixed(2) || '0.00'}</p>
                                                    <p className="text-gray-300">Status: <span className={`font-semibold ${loan.loanStatus === 'approved' ? 'text-green-400' : (loan.loanStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400')}`}>{statusText}</span></p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {showCancelButton && (
                                                        <button onClick={() => handleCancelLoan(loan.id)} className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Cancel</button>
                                                    )}
                                                    {showPayButton && (
                                                        <button onClick={() => handlePayLoan(loan.id)} className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">Pay Full Amount</button>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No active loans.</p>
                            )}
                        </div>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft">
                            <h2 className="text-xl font-bold text-green-400 mb-4">Transaction History</h2>
                            {allTransactions.length > 0 ? (
                                <div className="max-h-80 overflow-y-auto">
                                    <table className="min-w-full text-sm text-left">
                                        <thead className="bg-gray-700 sticky top-0">
                                            <tr>
                                                <th className="p-2 text-gray-300">Date</th>
                                                <th className="p-2 text-gray-300">Type</th>
                                                <th className="p-2 text-gray-300">Description</th>
                                                <th className="p-2 text-right text-gray-300">Amount</th>
                                                <th className="p-2 text-right text-gray-300">Tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allTransactions.map((tx, index) => (
                                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                                                    <td className="p-2 text-gray-400">{(new Date(tx.date || tx.timestamp)).toLocaleDateString()}</td>
                                                    <td className="p-2 text-gray-300">{tx.type}</td>
                                                    <td className="p-2 text-gray-300">{tx.item || tx.jobName || tx.description}</td>
                                                    <td className={`p-2 text-right font-semibold ${Number(tx.amount || 0) < 0 ? 'text-red-400' : 'text-green-400'}`}>{Number(tx.amount || 0).toFixed(2)}</td>
                                                    <td className="p-2 text-right text-red-400">{tx.tax?.toFixed(2) || '0.00'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-400">No transactions yet.</p>
                            )}
                        </div>
                    </div>
                );
            }

                const TaxPage = ({ currentUserAccount, setCurrentUserAccount, handlePayTax, handleAdvanceTax, showModal, paymentAnimationDetails, setPaymentAnimationDetails }) => {
            const chartRef = useRef(null);
            const chartInstanceRef = useRef(null); // Use a ref to store the chart instance
            const [chartDataType, setChartDataType] = useState('applied'); // Renamed from chartData to avoid confusion
            const [customTaxAmount, setCustomTaxAmount] = useState('');
            const [session, setSession] = useState(null);
            const [isPaying, setIsPaying] = useState(false);

            if (!currentUserAccount) return null;
            const { taxData = {}, accountId, transactions = [], balance } = currentUserAccount;

            const totalTaxPaidTillYet = (transactions || []).filter(tx => tx.description && (tx.description.includes('Tax payment') || tx.description.includes('Advance tax payment'))).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

            // Ensure taxData.players is an object, or default to an empty object
            const playersData = taxData.players && typeof taxData.players === 'object' ? taxData.players : {};

            // Get the current session from taxData, or default to 'unknown'
            const currentSession = taxData.currentSession || 'unknown';

            const sessionTaxData = playersData[accountId] && playersData[accountId].sessions && playersData[accountId].sessions[currentSession]
                ? playersData[accountId].sessions[currentSession]
                : { taxDue: 0, taxPaid: 0, advancePaid: 0, dailyCharges: [] };

            // Ensure dailyTaxCharges is an array of objects with date and amount
            const dailyCharges = sessionTaxData.dailyCharges || [];

            // Filter tax payments, ensuring amount is positive for display
            const taxPayments = transactions.filter(tx => tx.description.includes('tax payment'))
                                        .map(tx => ({ date: tx.date, amount: Math.abs(tx.amount), description: tx.description.replace(/ for session [^,]+/, '') }));

            const dataToDisplay = chartDataType === 'applied' ? dailyCharges : taxPayments;

            useEffect(() => {
                if (!chartRef.current) {
                    // If canvas ref is not available, or component unmounted, do nothing
                    return;
                }

                // Destroy existing chart instance before creating a new one
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.destroy();
                    chartInstanceRef.current = null;
                }

                if (dataToDisplay.length > 0) {
                    const ctx = chartRef.current.getContext('2d');
                    if (!ctx) { // Defensive check for context
                        console.error("Could not get 2D context for canvas.");
                        return;
                    }
                    chartInstanceRef.current = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dataToDisplay.map(c => new Date(c.date).toLocaleDateString()),
                            datasets: [{
                                label: `Daily Tax ${chartDataType === 'applied' ? 'Applied' : 'Paid'} ($)`,
                                data: dataToDisplay.map(c => c.amount),
                                borderColor: '#2dd4bf',
                                backgroundColor: 'rgba(45, 212, 191, 0.2)',
                                fill: true,
                                tension: 0.4,
                                pointRadius: 5,
                                pointHoverRadius: 8,
                                pointBackgroundColor: '#2dd4bf'
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#d1d5db'
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => `Amount: ${context.raw.toFixed(2)}`,
                                        afterLabel: (context) => dataToDisplay[context.dataIndex].description ? `Info: ${dataToDisplay[context.dataIndex].description}` : ''
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    ticks: { color: '#9ca3af' },
                                    grid: { color: 'rgba(107, 114, 128, 0.3)' }
                                },
                                y: {
                                    ticks: { color: '#9ca3af' },
                                    grid: { color: 'rgba(107, 114, 128, 0.3)' }
                                }
                            }
                        }
                    });
                }
                // Cleanup function to destroy chart on unmount or data change
                return () => {
                    if (chartInstanceRef.current) {
                        chartInstanceRef.current.destroy();
                        chartInstanceRef.current = null;
                    }
                };
            }, [dataToDisplay, chartDataType]); // Re-render chart when dataToDisplay or chartDataType changes

            const downloadReport = () => {
                if (!chartRef.current) {
                    showModal('Error', 'Chart not rendered yet. Please view the chart before downloading.', 'error');
                    return;
                }

                const chartImage = chartRef.current.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = chartImage;
                link.download = `tax-chart-${accountId}-${chartDataType}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                showModal('Download Complete', 'Tax chart downloaded successfully!', 'success');
            };

            const downloadFullDetails = () => {
                const taxTransactions = transactions.filter(tx => tx.description.includes('tax payment') || tx.description.includes('Advance tax payment'));
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(taxTransactions, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", `tax-details-${accountId}.json`);
                document.body.appendChild(downloadAnchorNode); // Required for Firefox
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                showModal('Download Complete', 'Full tax details downloaded successfully!', 'success');
            };

            const onPayTax = async (amount, isFullTax = false) => {
                if (balance < amount) {
                    showModal('Insufficient Balance', 'Do you want to deduct the amount from your Minecraft account?', 'info');
                    return;
                }
                setIsPaying(true);
                await handlePayTax(amount, isFullTax);
                setIsPaying(false);
            };

            const onAdvanceTax = async (amount) => {
                if (balance < amount) {
                    showModal('Insufficient Balance', 'Do you want to deduct the amount from your Minecraft account?', 'info');
                    return;
                }
                setIsPaying(true);
                await handleAdvanceTax(amount);
                setIsPaying(false);
            };

            return (
                <div className="space-y-6 relative"> {/* Added relative positioning */}
                    {paymentAnimationDetails.show && (
                        <PaymentLoadingAnimation
                            amount={paymentAnimationDetails.amount}
                            status={paymentAnimationDetails.status}
                            paymentType={paymentAnimationDetails.paymentType}
                            onAnimationComplete={() => setPaymentAnimationDetails({ show: false, amount: 0, status: 'processing', paymentType: '' })}
                        />
                    )}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft flex items-center justify-between">
                        <div><h2 className="text-xl font-bold text-green-400 mb-2">Tax Summary</h2><p className="text-gray-300">Total Due: <span className="font-bold text-red-400">${sessionTaxData.taxDue?.toFixed(2) || '0.00'}</span></p><p className="text-gray-300">Current Session Paid: <span className="font-bold text-green-400">${sessionTaxData.taxPaid?.toFixed(2) || '0.00'}</span></p>
<p className="text-gray-300">Total Tax Paid (All Sessions): <span className="font-bold text-green-400">${totalTaxPaidTillYet.toFixed(2)}</span></p><p className="text-gray-300">Advance Paid: <span className="font-bold text-blue-400">${sessionTaxData.advancePaid?.toFixed(2) || '0.00'}</span></p>{sessionTaxData.taxDue > 0 ? (<><button onClick={() => onPayTax(sessionTaxData.taxDue, true)} disabled={isPaying} className="mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500"> {isPaying ? 'Paying...' : 'Pay Full Amount'}</button><input type="number" value={customTaxAmount} onChange={(e) => setCustomTaxAmount(e.target.value)} placeholder="Custom Amount" className="ml-2 p-2 bg-gray-700 border border-gray-600 rounded-md" /><button onClick={() => onPayTax(parseFloat(customTaxAmount), false)} disabled={isPaying} className="ml-2 bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500"> {isPaying ? 'Paying...' : 'Make Custom Payment'}</button></>) : (<div className="mt-4"><input type="number" value={customTaxAmount} onChange={(e) => setCustomTaxAmount(e.target.value)} placeholder="Advance Amount" className="p-2 bg-gray-700 border border-gray-600 rounded-md" /><button onClick={() => onAdvanceTax(parseFloat(customTaxAmount))} disabled={isPaying} className="ml-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500"> {isPaying ? 'Paying...' : 'Pay Advance'}</button></div>)}</div>
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-md border-4 border-yellow-400 bg-minecraft-world overflow-hidden"><span className="relative z-10">{currentUserAccount.accountId.charAt(0).toUpperCase()}</span></div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft">
                        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-green-400">Tax Trend</h2><div className="flex gap-2"><button onClick={() => setChartDataType('applied')} className={`px-3 py-1 text-sm rounded-md ${chartDataType === 'applied' ? 'bg-green-600 text-white' : 'bg-gray-700'}`}>Applied</button><button onClick={() => setChartDataType('paid')} className={`px-3 py-1 text-sm rounded-md ${chartDataType === 'paid' ? 'bg-green-600 text-white' : 'bg-gray-700'}`}>Paid</button><button onClick={downloadReport} className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white">Download Chart</button><button onClick={downloadFullDetails} className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white">Download Details</button></div></div>
                        <div className="relative h-60">{dataToDisplay.length > 0 ? <canvas ref={chartRef}></canvas> : <p className="text-gray-400">No tax data to display for this session.</p>}</div>
                    </div>
                </div>
            );
        };

        const ApplyLoanPage = ({ currentUserAccount, showModal, handleApplyLoan }) => {
            const [loanDetails, setLoanDetails] = useState({
                amount: '', duration: 1, type: 'personal', purpose: '',
                coords: [{ x: '', y: '', z: '' }], // Array to hold multiple coordinate sets
                repayment: 'daily',
                loanerNetWorth: '',
                valueOfLand: '', valueOfBuilding: '', areaVolume: '',
                playerScreenshot: '', landPhoto: '', buildingPhoto: '',
                employeePhoto: '', signatureOfBankEmployee: '',
            });
            const [isCompound, setIsCompound] = useState(false);
            const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status
            const hasIncomeProfile = (currentUserAccount.jobPerDayIncome > 0 || currentUserAccount.businessPerDayIncome > 0);
            const loanDurationLimits = { personal: 5, home: 3, business: 6, homeStartup: 4, bizStartup: 6 };
            const maxDuration = loanDurationLimits[loanDetails.type];

            const { perPaymentAmount, principalPerPayment, interestPerPayment, totalInterestAmount, weeklyInterestRateDisplay, totalArea, landValue, buildingValue } = useMemo(() => {
                const amount = parseFloat(loanDetails.amount) || 0;
                const durationWeeks = parseInt(loanDetails.duration) || 0;
                if (!amount || !durationWeeks) return { perPaymentAmount: 0, principalPerPayment: 0, interestPerPayment: 0, totalInterestAmount: 0, weeklyInterestRateDisplay: 0 };

                const interestRates = {
                    personal: 0.06,
                    home: 0.02,
                    business: 0.05,
                    bizStartup: [0.02, 0.04, 0.05, 0.06, 0.08], // Weeks 1-5
                    homeStartup: [0.015, 0.02, 0.03, 0.05, 0.07] // Weeks 1-5
                };

                let weeklyRate;
                if (loanDetails.type.includes('Startup')) {
                    weeklyRate = interestRates[loanDetails.type][durationWeeks - 1]; // duration is 1-indexed for weeks
                } else {
                    weeklyRate = interestRates[loanDetails.type];
                }

                let totalLoanAmountDue;
                let calculatedTotalInterest = 0;

                if (isCompound) {
                    // Compound interest: calculate total amount due based on daily compounding
                    const dailyRate = Math.pow(1 + weeklyRate, 1/7) - 1; // Convert weekly rate to daily
                    totalLoanAmountDue = amount * Math.pow(1 + dailyRate, durationWeeks * 7);
                    calculatedTotalInterest = totalLoanAmountDue - amount;
                } else {
                    // Simple interest for the whole period (duration in weeks)
                    calculatedTotalInterest = amount * weeklyRate * durationWeeks;
                    totalLoanAmountDue = amount + calculatedTotalInterest;
                }

                const numberOfPayments = loanDetails.repayment === 'daily' ? durationWeeks * 7 : durationWeeks;
                const perPaymentAmount = totalLoanAmountDue / numberOfPayments;
                const principalPerPayment = amount / numberOfPayments;
                const interestPerPayment = calculatedTotalInterest / numberOfPayments;

                const xCoords = loanDetails.coords.map(c => parseFloat(c.x)).filter(c => !isNaN(c));
                const zCoords = loanDetails.coords.map(c => parseFloat(c.z)).filter(c => !isNaN(c));
                const totalArea = xCoords.length > 1 && zCoords.length > 1 ? Math.abs((Math.max(...xCoords) - Math.min(...xCoords)) * (Math.max(...zCoords) - Math.min(...zCoords))) : 0;
                const landValue = totalArea * 10; // Assuming $10 per square block
                const buildingValue = parseFloat(loanDetails.valueOfBuilding) || 0;

                return {
                    perPaymentAmount: perPaymentAmount,
                    principalPerPayment: principalPerPayment,
                    interestPerPayment: interestPerPayment,
                    totalInterestAmount: calculatedTotalInterest,
                    weeklyInterestRateDisplay: weeklyRate * 100, // Display as percentage
                    totalArea: totalArea,
                    landValue: landValue,
                    buildingValue: buildingValue
                };
            }, [loanDetails.amount, loanDetails.duration, loanDetails.type, loanDetails.repayment, isCompound]);

            const handleChange = (e) => {
                const { name, value, type, files } = e.target;
                if (name.startsWith('coord')) {
                    const [prop, index, axis] = name.split('-');
                    const newCoords = [...loanDetails.coords];
                    newCoords[index] = { ...newCoords[index], [axis]: value };
                    setLoanDetails(prev => ({ ...prev, coords: newCoords }));
                } else if (type === 'file') {
                    setLoanDetails(prev => ({ ...prev, [name]: files[0] }));
                } else if (name === 'duration' && parseInt(value) > maxDuration) {
                    return;
                } else if (name === 'type') {
                    setLoanDetails({ ...loanDetails, duration: 1, [name]: value });
                } else {
                    setLoanDetails({ ...loanDetails, [name]: value });
                }
            };

            const onSubmitLoan = async (e) => { // Made async
                e.preventDefault();
                if (!hasIncomeProfile) { showModal('Profile Incomplete', 'Please set your income in Account Settings before applying.', 'error'); return; }
                setIsSubmitting(true); // Disable button on submit
                try {
                    const loanDataToSend = {
                        ...loanDetails,
                        loanerBankId: currentUserAccount.bankId,
                        loanerUsername: currentUserAccount.accountId,
                        loanerPerDayIncome: currentUserAccount.jobPerDayIncome + (currentUserAccount.businessIncomeUnit === 'hour' ? currentUserAccount.businessPerDayIncome * 8 : currentUserAccount.businessPerDayIncome),
                        hasBusiness: currentUserAccount.hasBusiness,
                        coord1: loanDetails.coords[0] ? `${loanDetails.coords[0].x},${loanDetails.coords[0].y},${loanDetails.coords[0].z}` : '',
                        coord2: loanDetails.coords[1] ? `${loanDetails.coords[1].x},${loanDetails.coords[1].y},${loanDetails.coords[1].z}` : '',
                        loanStatus: 'pending',
                        applicationDate: new Date().toISOString(),
                    };
                    await handleApplyLoan(loanDataToSend);
                    setLoanDetails({
                        amount: '', duration: 1, type: 'personal', purpose: '',
                        coords: [{ x: '', y: '', z: '' }],
                        repayment: 'daily',
                        loanerNetWorth: '',
                        valueOfLand: '', valueOfBuilding: '', areaVolume: '',
                        playerScreenshot: '', landPhoto: '', buildingPhoto: '',
                        employeePhoto: '', signatureOfBankEmployee: '',
                    });
                } finally {
                    setIsSubmitting(false); // Re-enable button after submission (success or failure)
                }
            };

            const showLoanSpecificFields = loanDetails.type === 'home' || loanDetails.type === 'business' || loanDetails.type.includes('Startup');

            return (
                <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft max-w-lg mx-auto">
                    <h2 className="text-xl font-bold text-green-400 mb-4">New Loan Application</h2>
                    <form onSubmit={onSubmitLoan} className="space-y-4">
                        <select name="type" value={loanDetails.type} onChange={handleChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md">
                            <option value="personal">Personal</option>
                            <option value="home">Home</option>
                            <option value="business">Business</option>
                            <option value="bizStartup">Business Startup</option>
                            <option value="homeStartup">Home Startup</option>
                        </select>
                        <input name="amount" type="number" value={loanDetails.amount} onChange={handleChange} placeholder="Loan Amount ($)" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                        <input name="duration" type="number" value={loanDetails.duration} onChange={handleChange} placeholder={`Duration (Weeks, max ${maxDuration})`} min="1" max={maxDuration} required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                        <select name="repayment" value={loanDetails.repayment} onChange={handleChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md">
                            <option value="daily">Daily</option>
                            <option value="weekly" disabled={loanDetails.duration < 2}>Weekly (2+ weeks)</option>
                        </select>
                        <div className="flex items-center">
                            <input type="checkbox" id="isCompound" name="isCompound" checked={isCompound} onChange={(e) => setIsCompound(e.target.checked)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                            <label htmlFor="isCompound" className="ml-2 block text-sm text-gray-300">
                                Compound Interest
                            </label>
                        </div>
                        <textarea name="purpose" value={loanDetails.purpose} onChange={handleChange} placeholder="What is the purpose of this loan?" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md h-24"></textarea>

                        <input name="loanerNetWorth" type="number" value={loanDetails.loanerNetWorth} onChange={handleChange} placeholder="Your Net Worth ($)" className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />

                        {loanDetails.type === 'personal' && (
                            <div className="space-y-4 pt-2 border-t border-gray-700">
                                <h3 className="text-lg font-semibold text-yellow-400">Personal Loan Details</h3>
                                <p className="text-sm text-gray-400">Please provide the coordinates for the location related to your loan purpose.</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <input name="coord-0-x" type="number" value={loanDetails.coords[0]?.x || ''} onChange={handleChange} placeholder="X" className="p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                    <input name="coord-0-y" type="number" value={loanDetails.coords[0]?.y || ''} onChange={handleChange} placeholder="Y" className="p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                    <input name="coord-0-z" type="number" value={loanDetails.coords[0]?.z || ''} onChange={handleChange} placeholder="Z" className="p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                </div>
                                <label className="block text-gray-300">Player Screenshot:</label>
                                <input name="playerScreenshot" type="file" onChange={handleChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                {loanDetails.playerScreenshot && <p className="text-sm text-gray-400">Selected: {loanDetails.playerScreenshot.name}</p>}
                            </div>
                        )}

                        {(loanDetails.type === 'home' || loanDetails.type === 'business' || loanDetails.type.includes('Startup')) && (
                            <div className="space-y-4 pt-2 border-t border-gray-700">
                                <h3 className="text-lg font-semibold text-yellow-400">Property/Business Details</h3>
                                <input name="areaVolume" type="number" value={loanDetails.areaVolume} onChange={handleChange} placeholder="Area/Volume (sq/cu blocks)" className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                <input name="valueOfLand" type="number" value={loanDetails.valueOfLand} onChange={handleChange} placeholder="Value of Land ($)" className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                <input name="valueOfBuilding" type="number" value={loanDetails.valueOfBuilding} onChange={handleChange} placeholder="Value of Building ($)" className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                <p className="text-sm text-gray-400">Corner Coordinates (up to 10 corners)</p>
                                {loanDetails.coords.map((coord, index) => (
                                    <div key={index} className="grid grid-cols-4 gap-2">
                                        <input name={`coord-${index}-x`} type="number" value={coord?.x || ''} onChange={handleChange} placeholder="X" className="p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                        <input name={`coord-${index}-y`} type="number" value={coord?.y || ''} onChange={handleChange} placeholder="Y" className="p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                        <input name={`coord-${index}-z`} type="number" value={coord?.z || ''} onChange={handleChange} placeholder="Z" className="p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                        {loanDetails.coords.length > 1 && (
                                            <button type="button" onClick={() => setLoanDetails(prev => ({ ...prev, coords: prev.coords.filter((_, i) => i !== index) }))} className="p-3 bg-red-600 text-white rounded-md">-</button>
                                        )}
                                    </div>
                                ))}
                                {loanDetails.coords.length < 10 && (
                                    <button type="button" onClick={() => setLoanDetails(prev => ({ ...prev, coords: [...prev.coords, { x: '', y: '', z: '' }] }))} className="w-full p-3 bg-blue-600 text-white rounded-md">Add Coordinate</button>
                                )}
                                <p className="text-gray-300">Calculated Area: <span className="font-bold text-yellow-400">{totalArea?.toFixed(2) || '0.00'}</span></p>
                                <label className="block text-gray-300">Land Photo:</label>
                                <input name="landPhoto" type="file" onChange={handleChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                {loanDetails.landPhoto && <p className="text-sm text-gray-400">Selected: {loanDetails.landPhoto.name}</p>}
                                <label className="block text-gray-300">Building Photo:</label>
                                <input name="buildingPhoto" type="file" onChange={handleChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                {loanDetails.buildingPhoto && <p className="text-sm text-gray-400">Selected: {loanDetails.buildingPhoto.name}</p>}
                            </div>
                        )}

                        <div className="p-3 bg-gray-700 rounded-md text-center">
                            <p className="text-gray-300">Total Area: <span className="font-bold text-yellow-400">{totalArea?.toFixed(2) || '0.00'}</span></p>
                            <p className="text-gray-300">Estimated Land Value: <span className="font-bold text-yellow-400">${landValue?.toFixed(2) || '0.00'}</span></p>
                            <p className="text-gray-300">Building Value: <span className="font-bold text-yellow-400">${buildingValue?.toFixed(2) || '0.00'}</span></p>
                            <p className="text-gray-300">Payment per {loanDetails.repayment === 'daily' ? 'Day' : 'Week'}: <span className="font-bold text-yellow-400">${perPaymentAmount?.toFixed(2) || '0.00'}</span></p>
                            <p className="text-gray-300 text-sm">(Principal: ${principalPerPayment?.toFixed(2) || '0.00'}, Interest: ${interestPerPayment?.toFixed(2) || '0.00'})</p>
                            <p className="text-gray-300">Total Interest: <span className="font-bold text-red-400">${totalInterestAmount?.toFixed(2) || '0.00'}</span></p>
                            <p className="text-xs text-gray-400">Weekly Interest Rate: {weeklyInterestRateDisplay?.toFixed(2) || '0.00'}%</p>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md">{isSubmitting ? 'Submitting...' : 'Submit Application'}</button>
                        {!hasIncomeProfile && <p className="text-red-400 mt-4 text-sm text-center">Your income profile is not set up. You must set your income in Account Settings to apply for a loan.</p>}
                    </form>
                </div>
            );
        };

        const AccountSettingsPage = ({ currentUserAccount, handleChangePassword, handleUpdateProfile }) => {
            if (!currentUserAccount) return null;
            const [oldPassword, setOldPassword] = useState('');
            const [newPassword, setNewPassword] = useState('');
            const [profile, setProfile] = useState({
                jobType: currentUserAccount.jobType || '',
                jobPerDayIncome: currentUserAccount.jobPerDayIncome || '',
                businessType: currentUserAccount.businessType || '',
                businessPerDayIncome: currentUserAccount.businessPerDayIncome || '',
                businessIncomeUnit: currentUserAccount.businessIncomeUnit || 'day',
                hasBusiness: !!currentUserAccount.businessType
            });
            const [editMode, setEditMode] = useState({ job: false, business: false, password: false });

            const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
            const onProfileSubmit = (e) => { e.preventDefault(); handleUpdateProfile(profile); setEditMode({ ...editMode, job: false, business: false }); };
            const onPasswordSubmit = (e) => { e.preventDefault(); handleChangePassword(oldPassword, newPassword); setOldPassword(''); setNewPassword(''); setEditMode(prev => ({...prev, password: false})); };

            return (
                <div className="space-y-8">
                    <h1 className="text-3xl font-bold text-green-400">Account Settings</h1>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-shrink-0 md:w-1/3 flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-md border-4 border-green-500 bg-minecraft-world overflow-hidden"><span className="relative z-10">{currentUserAccount.accountId.charAt(0).toUpperCase()}</span></div>
                            <h3 className="text-2xl font-bold mt-4">{currentUserAccount.accountId}</h3>
                            <p className="text-gray-400"><strong>Email:</strong> {currentUserAccount.email}</p>
                            <p className="text-gray-400"><strong>Bank ID:</strong> {currentUserAccount.bankId}</p>
                            <p className="text-400"><strong>Edition:</strong> {currentUserAccount.edition}</p>
                            <p className="text-gray-400"><strong>Bank Name:</strong> {currentUserAccount.bankName}</p>
                        </div>
                        <div className="flex-1 space-y-6">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft">
                                <h2 className="text-xl font-bold text-green-400 mb-4">Income Profile</h2>
                                <form onSubmit={onProfileSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-gray-300">Job Type: </label>
                                        <input name="jobType" value={profile.jobType} onChange={handleProfileChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="text-gray-300">Job Income per Day: </label>
                                        <input name="jobPerDayIncome" type="number" value={profile.jobPerDayIncome} onChange={handleProfileChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                    </div>
                                    <div className="flex items-center gap-4 mt-4"><label className="text-gray-300">Have a business?</label><input type="checkbox" checked={profile.hasBusiness} onChange={(e) => setProfile({...profile, hasBusiness: e.target.checked})} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500" /></div>
                                    {profile.hasBusiness && <>
                                        <div>
                                            <label className="text-gray-300">Business Type: </label>
                                            <input name="businessType" value={profile.businessType} onChange={handleProfileChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="text-gray-300">Business Income: </label>
                                            <input name="businessPerDayIncome" type="number" value={profile.businessPerDayIncome} onChange={handleProfileChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" />
                                        </div>
                                        <div>
                                            <label className="text-gray-300">Income Unit: </label>
                                            <select name="businessIncomeUnit" value={profile.businessIncomeUnit} onChange={handleProfileChange} className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"><option value="day">Per Day</option><option value="hour">Per Hour</option></select>
                                        </div>
                                    </>}
                                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">Save Changes</button>
                                </form>
                            </div>
                            <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft"><h2 className="text-xl font-bold text-green-400 mb-4">Change Password</h2><form onSubmit={onPasswordSubmit} className="space-y-4 max-w-sm"><input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" /><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" required className="w-full p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" /><button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700">Change Password</button></form></div></div>
                    </div>
                </div>
            );
        };

        const TopTaxPayersPage = ({ getAllAccounts }) => {
            const [topTaxPayers, setTopTaxPayers] = useState([]);
            useEffect(() => {
                const fetchTopTaxPayers = async () => {
                    const accounts = await getAllAccounts();
                    const sorted = accounts.filter(acc => acc.taxData?.taxPaid !== undefined && acc.taxData.taxPaid !== null)
                                           .sort((a, b) => (b.taxData.taxPaid || 0) - (a.taxData.taxPaid || 0))
                                           .slice(0, 3);
                    setTopTaxPayers(sorted);
                };
                fetchTopTaxPayers();
            }, [getAllAccounts]);

            return (
                <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft animate-fade-in">
                    <h1 className="text-3xl font-bold text-green-400 mb-6">🏆 Top 3 Tax Payers</h1>
                    {topTaxPayers.length > 0 ? (
                        <ul className="space-y-4">
                            {topTaxPayers.map((player, index) => (
                                <li key={player.bankId} className="flex items-center bg-gray-700 p-4 rounded-md shadow-md">
                                    <span className="text-2xl font-bold mr-4">{index + 1}.</span>
                                    <div className="flex-grow">
                                        <p className="text-lg font-semibold">{player.accountId}</p>
                                        <p className="text-gray-400">Paid: ${player.taxData?.taxPaid?.toFixed(2) || '0.00'}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No tax data available to display top payers.</p>
                    )}
                </div>
            );
        };

        const TopAdvanceTaxPayersPage = ({ getAllAccounts }) => {
            const [topAdvanceTaxPayers, setTopAdvanceTaxPayers] = useState([]);
            useEffect(() => {
                const fetchTopAdvanceTaxPayers = async () => {
                    const accounts = await getAllAccounts();
                    const sorted = accounts.filter(acc => acc.taxData?.advanceTaxPaid !== undefined && acc.taxData.advanceTaxPaid !== null)
                                           .sort((a, b) => (b.taxData.advanceTaxPaid || 0) - (a.taxData.advanceTaxPaid || 0))
                                           .slice(0, 3);
                    setTopAdvanceTaxPayers(sorted);
                };
                fetchTopAdvanceTaxPayers();
            }, [getAllAccounts]);

            return (
                <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft animate-fade-in">
                    <h1 className="text-3xl font-bold text-green-400 mb-6">🥇 Top 3 Advance Tax Payers</h1>
                    {topAdvanceTaxPayers.length > 0 ? (
                        <ul className="space-y-4">
                            {topAdvanceTaxPayers.map((player, index) => (
                                <li key={player.bankId} className="flex items-center bg-gray-700 p-4 rounded-md shadow-md">
                                    <span className="text-2xl font-bold mr-4">{index + 1}.</span>
                                    <div className="flex-grow">
                                        <p className="text-lg font-semibold">{player.accountId}</p>
                                        <p className="text-gray-400">Advance Paid: ${player.taxData?.advanceTaxPaid?.toFixed(2) || '0.00'}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No advance tax data available to display top payers.</p>
                    )}
                </div>
            );
        };

        const ContactUsPage = ({ showModal, currentUserAccount }) => {
            const [messages, setMessages] = useState([]);
            const [newMessage, setNewMessage] = useState('');

            useEffect(() => {
                const fetchMessages = async () => {
                    try {
                        const response = await fetch(`${API_ENDPOINTS.ACCOUNTS}/messages`);
                        if (response.ok) {
                            const data = await response.json();
                            setMessages(data.filter(m => m.username === currentUserAccount.accountId));
                        }
                    } catch (error) {
                        console.error("Error fetching messages:", error);
                    }
                };

                if (currentUserAccount) {
                    fetchMessages();
                }
            }, [currentUserAccount]);

            const handleSendMessage = async (e) => {
                e.preventDefault();
                if (!newMessage.trim()) return;

                try {
                    const response = await fetch(API_ENDPOINTS.CONTACT, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: currentUserAccount.accountId,
                            problem: newMessage,
                            platform: 'web',
                            language: 'english'
                         }),
                    });

                    if (response.ok) {
                        setNewMessage('');
                        // Refetch messages to show the new one
                        const messagesResponse = await fetch(`${API_ENDPOINTS.ACCOUNTS}/messages`);
                        if (messagesResponse.ok) {
                            const data = await messagesResponse.json();
                            setMessages(data.filter(m => m.username === currentUserAccount.accountId));
                        }
                    } else {
                        const errorData = await response.json();
                        showModal('Error', errorData.message || 'Failed to send message. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error("Contact form submission error:", error);
                    showModal('Error', 'Could not connect to the contact service.', 'error');
                }
            };

            return (
                <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft animate-fade-in max-w-lg mx-auto">
                    <h1 className="text-3xl font-bold text-green-400 mb-6">📞 Contact Us</h1>
                    <div className="space-y-4 h-96 overflow-y-auto p-4 bg-gray-700 rounded-md">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`chat-message ${msg.sender === 'admin' ? 'text-left' : 'text-right'}`}>
                                <div className={`inline-block p-2 rounded-lg ${msg.sender === 'admin' ? 'bg-gray-600' : 'bg-green-600'}`}>
                                    <p className="text-sm">{msg.problem}</p>
                                    {msg.replies && msg.replies.map((reply, index) => (
                                        <div key={index} className="mt-2 pt-2 border-t border-gray-500">
                                            <p className="text-xs font-bold">{reply.sender}</p>
                                            <p className="text-xs">{reply.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-grow p-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md">Send</button>
                    </form>
                </div>
            );
        };

        const ThemeSettingsPage = ({ showModal }) => {
            const [theme, setTheme] = useState(() => {
                const savedTheme = localStorage.getItem('appTheme');
                return savedTheme ? JSON.parse(savedTheme) : {
                    primaryColor: '#4CAF50',
                    secondaryColor: '#8BC34A',
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    animationSpeed: '1s',
                    brightness: '100%',
                    fontFamily: 'Inter',
                    buttonStyle: 'rounded',
                    glowColor: '#00ff00',
                    blockColor: '#1f2937',
                    backgroundColorBody: '#f4f7fc',
                    backgroundImageUrl: 'none',
                    textColor: '#1a202c',
                    blockBorderColor: '#2c3e50',
                    loadingBgColor: '#1a202c',
                };
            });

            useEffect(() => {
                applyTheme(theme);
            }, [theme]);

            const applyTheme = (currentTheme) => {
                const root = document.documentElement;
                root.style.setProperty('--primary-color', currentTheme.primaryColor);
                root.style.setProperty('--secondary-color', currentTheme.secondaryColor);
                root.style.setProperty('--shadow-color', currentTheme.shadowColor);
                root.style.setProperty('--shadow-color-lg', currentTheme.shadowColor.replace('0.4', '0.6'));
                root.style.setProperty('--animation-speed', currentTheme.animationSpeed);
                root.style.setProperty('--brightness', currentTheme.brightness);
                root.style.setProperty('--font-family', currentTheme.fontFamily);
                root.style.setProperty('--button-border-radius', currentTheme.buttonStyle === 'rounded' ? '0.375rem' : '0');
                root.style.setProperty('--glow-color', currentTheme.glowColor);
                root.style.setProperty('--block-color', currentTheme.blockColor);
                root.style.setProperty('--background-color-body', currentTheme.backgroundColorBody);
                document.body.style.backgroundImage = currentTheme.backgroundImageUrl === 'none' ? 'none' : `url('${currentTheme.backgroundImageUrl}')`;
                root.style.setProperty('--text-color', currentTheme.textColor);
                root.style.setProperty('--block-border-color', currentTheme.blockBorderColor);
                root.style.setProperty('--loading-bg-color', currentTheme.loadingBgColor);

                // Apply to body directly for immediate effect on background
                document.body.style.backgroundColor = currentTheme.backgroundColorBody;
                document.body.style.color = currentTheme.textColor;
            };

            const handleChange = (e) => {
                const { name, value } = e.target;
                let newValue = value;
                if (name === 'animationSpeed') newValue = `${value}s`;
                if (name === 'brightness') newValue = `${value}%`;
                setTheme(prev => ({ ...prev, [name]: newValue }));
            };

            const saveTheme = () => {
                localStorage.setItem('appTheme', JSON.stringify(theme));
                showModal('Theme Saved', 'Your theme settings have been saved!', 'success');
            };

            const resetTheme = () => {
                const defaultTheme = {
                    primaryColor: '#4CAF50',
                    secondaryColor: '#8BC34A',
                    shadowColor: 'rgba(0, 0, 0, 0.4)',
                    animationSpeed: '1s',
                    brightness: '100%',
                    fontFamily: 'Inter',
                    buttonStyle: 'rounded',
                    glowColor: '#00ff00',
                    blockColor: '#1f2937',
                    backgroundColorBody: '#f4f7fc',
                    backgroundImageUrl: 'none',
                    textColor: '#1a202c',
                    blockBorderColor: '#2c3e50',
                    loadingBgColor: '#1a202c',
                };
                setTheme(defaultTheme);
                localStorage.removeItem('appTheme');
                showModal('Theme Reset', 'Theme settings have been reset to default.', 'info');
            };

            return (
                <div className="bg-gray-800 p-6 rounded-lg shadow-minecraft animate-fade-in">
                    <h1 className="text-3xl font-bold text-green-400 mb-6">Theme Settings</h1>
                    <div className="space-y-4">
                        <div><label className="block text-gray-300">Primary Color:</label><input type="color" name="primaryColor" value={theme.primaryColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Secondary Color:</label><input type="color" name="secondaryColor" value={theme.secondaryColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Shadow Color:</label><input type="color" name="shadowColor" value={theme.shadowColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Glow Color:</label><input type="color" name="glowColor" value={theme.glowColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Block Color:</label><input type="color" name="blockColor" value={theme.blockColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Background Color:</label><input type="color" name="backgroundColorBody" value={theme.backgroundColorBody} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Text Color:</label><input type="color" name="textColor" value={theme.textColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Block Border Color:</label><input type="color" name="blockBorderColor" value={theme.blockBorderColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Loading Screen Background Color:</label><input type="color" name="loadingBgColor" value={theme.loadingBgColor} onChange={handleChange} className="w-full h-10" /></div>
                        <div><label className="block text-gray-300">Background Image URL:</label><input type="text" name="backgroundImageUrl" value={theme.backgroundImageUrl} onChange={handleChange} placeholder="Enter image URL or 'none'" className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" /></div>
                        <div><label className="block text-gray-300">Animation Speed (s):</label><input type="range" name="animationSpeed" min="0.1" max="5" step="0.1" value={parseFloat(theme.animationSpeed)} onChange={handleChange} className="w-full" /><span className="text-gray-400">{theme.animationSpeed}</span></div>
                        <div><label className="block text-gray-300">Brightness (%):</label><input type="range" name="brightness" min="50" max="150" step="1" value={parseFloat(theme.brightness)} onChange={handleChange} className="w-full" /><span className="text-gray-400">{theme.brightness}</span></div>
                        <div><label className="block text-gray-300">Font Family:</label><input type="text" name="fontFamily" value={theme.fontFamily} onChange={handleChange} placeholder="e.g., Inter" className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md" /></div>
                        <div><label className="block text-gray-300">Button Style:</label><select name="buttonStyle" value={theme.buttonStyle} onChange={handleChange} className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"><option value="rounded">Rounded</option><option value="square">Square</option></select></div>
                        <button onClick={saveTheme} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-2">Save Theme</button>
                        <button onClick={resetTheme} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">Reset Theme</button>
                    </div>
                </div>
            );
        };



        // --- Main App Component ---
        const App = () => {
            const [currentPage, setCurrentPage] = useState('home'); // Start with home page for player view
            const [currentUserAccount, setCurrentUserAccount] = useState(null);
            const [session, setSession] = useState(null);
            const [loading, setLoading] = useState(true);
            const [loginSuccess, setLoginSuccess] = useState(false);
            const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info', callback: null });
            const [notification, setNotification] = useState(null);
            const [paymentAnimationDetails, setPaymentAnimationDetails] = useState({ show: false, amount: 0, status: 'processing', paymentType: '' });

            const showModal = (title, message, type = 'info', callback = null) => setModal({ isOpen: true, title, message, type, callback });
            const closeModal = () => { if (modal.callback) modal.callback(); setModal({ isOpen: false, title: '', message: '', type: 'info', callback: null }); };

            const getAllAccounts = async () => {
                try {
                    const response = await fetch(`${API_ENDPOINTS.ACCOUNTS}/accounts`);
                    if (!response.ok) throw new Error('Failed to fetch accounts');
                    return await response.json();
                } catch (error) {
                    console.error("Error fetching accounts:", error);
                    showModal('Error', 'Could not load accounts from server.', 'error');
                    return [];
                }
            };
            const saveAllAccounts = async (accounts) => {
                // This function is now handled by the Cloudflare Worker on update-account/create-account
                // For initial setup, we might still use it to populate the GitHub JSON if it's empty
                // but subsequent saves will go through the worker.
                console.log("Save all accounts called. This should ideally go through a worker.", accounts);
            };

            // Initial app load effect
            useEffect(() => {
                const refreshCurrentUserAccount = async () => {
                    if (currentUserAccount && currentUserAccount.accountId) {
                        try {
                            const [accountResponse, balancesResponse, shopTransactionsResponse, jobTransactionsResponse, loansResponse, messagesResponse, taxPaymentsResponse] = await Promise.all([
                                fetch(`${API_ENDPOINTS.ACCOUNTS}/accounts/${currentUserAccount.accountId}`),
                                fetch(API_ENDPOINTS.BALANCES),
                                fetch(API_ENDPOINTS.SHOP_TRANSACTIONS),
                                fetch(API_ENDPOINTS.JOB_TRANSACTIONS),
                                fetch(API_ENDPOINTS.LOANS),
                                fetch(API_ENDPOINTS.MESSAGES),
                                fetch(API_ENDPOINTS.TAX_PAYMENTS)
                            ]);

                            if (accountResponse.ok) {
                                const accountData = await accountResponse.json();
                                const balancesData = balancesResponse.ok ? await balancesResponse.json() : [];
                                const shopTransactionsData = shopTransactionsResponse.ok ? await shopTransactionsResponse.json() : [];
                                const jobTransactionsData = jobTransactionsResponse.ok ? await jobTransactionsResponse.json() : [];
                                const loansData = loansResponse.ok ? await loansResponse.json() : [];
                                const messagesData = messagesResponse.ok ? await messagesResponse.json() : [];
                                const taxPaymentsData = taxPaymentsResponse.ok ? await taxPaymentsResponse.json() : [];

                                const userLoans = loansData.filter(loan => loan.accountId === accountData.account.accountId);
                                const userBalances = balancesData.find(bal => bal.player === accountData.account.accountId);
                                const userShopTransactions = shopTransactionsData.filter(tx => tx.player === accountData.account.accountId);
                                const userJobTransactions = jobTransactionsData.filter(tx => tx.player === accountData.account.accountId);
                                const userMessages = messagesData.filter(msg => msg.username === accountData.account.accountId);
                                const userTaxPayments = taxPaymentsData.filter(tx => tx.player === accountData.account.accountId);

                                setCurrentUserAccount({
                                    ...accountData.account,
                                    loans: userLoans,
                                    minecraftBalance: userBalances ? userBalances.balance : 0,
                                    shopTransactions: userShopTransactions,
                                    jobTransactions: userJobTransactions,
                                    messages: userMessages,
                                    taxPayments: userTaxPayments
                                });
                            } else {
                                console.error("Failed to refresh user account:", accountResponse.statusText);
                            }
                        } catch (error) {
                            console.error("Error refreshing user account:", error);
                        }
                    }
                };

                const initializeApp = async () => {
                    let accounts = await getAllAccounts();
                    if (accounts.length === 0) {
                        const initialAccount = {
                            bankName: 'Gemini Test Bank', accountId: 'tester', email: 'tester@gemini.com', password: '26', edition: 'java', bankId: 'BANK006443',
                            balance: 10000, jobType: 'Diamond Miner', jobPerDayIncome: 250, businessType: 'Potion Shop', businessPerDayIncome: 150, businessIncomeUnit: 'day',
                            loans: [], transactions: []
                        };
                        accounts.push(initialAccount);
                    }
                    setLoading(false);
                    setCurrentUserAccount(accounts[0]);
                    setCurrentPage('home');
                };

                initializeApp();

                const intervalId = setInterval(refreshCurrentUserAccount, 5000); // Refresh every 5 seconds

                return () => clearInterval(intervalId); // Cleanup on unmount
            }, [currentUserAccount]);

            const handleLogin = async (identifier, password) => {
                setLoading(true);
                setLoginSuccess(false);

                try {
                    const response = await fetch(`${API_ENDPOINTS.ACCOUNTS}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ identifier, password })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Trigger tax processing in the worker
                        const processTaxResponse = await fetch(`${API_ENDPOINTS.TAX}/process-tax`, { method: 'POST' });
                        const processTaxData = await processTaxResponse.json();
                        console.log("Processed Tax Data from Worker:", processTaxData);

                        // Fetch tax data after successful login and processing
                        const taxResponse = await fetch(`${API_ENDPOINTS.TAX}/tax-data`);
                        const taxData = taxResponse.ok ? await taxResponse.json() : {};

                        // Fetch loan data
                        const [
                            balancesResponse,
                            shopTransactionsResponse,
                            jobTransactionsResponse,
                            loansResponse,
                            messagesResponse,
                            taxPaymentsResponse
                        ] = await Promise.all([
                            fetch(API_ENDPOINTS.BALANCES),
                            fetch(API_ENDPOINTS.SHOP_TRANSACTIONS),
                            fetch(API_ENDPOINTS.JOB_TRANSACTIONS),
                            fetch(API_ENDPOINTS.LOANS),
                            fetch(API_ENDPOINTS.MESSAGES),
                            fetch(API_ENDPOINTS.TAX_PAYMENTS)
                        ]);

                        const balancesData = balancesResponse.ok ? await balancesResponse.json() : [];
                        const shopTransactionsData = shopTransactionsResponse.ok ? await shopTransactionsResponse.json() : [];
                        const jobTransactionsData = jobTransactionsResponse.ok ? await jobTransactionsResponse.json() : [];
                        const loansData = loansResponse.ok ? await loansResponse.json() : [];
                        const messagesData = messagesResponse.ok ? await messagesResponse.json() : [];
                        const taxPaymentsData = taxPaymentsResponse.ok ? await taxPaymentsResponse.json() : [];

                        const userLoans = loansData.filter(loan => loan.accountId === data.account.accountId);
                        const userBalances = balancesData.find(bal => bal.player === data.account.accountId);
                        const userShopTransactions = shopTransactionsData.filter(tx => tx.player === data.account.accountId);
                        const userJobTransactions = jobTransactionsData.filter(tx => tx.player === data.account.accountId);
                        const userMessages = messagesData.filter(msg => msg.username === data.account.accountId);
                        const userTaxPayments = taxPaymentsData.filter(tx => tx.player === data.account.accountId);

                        setLoginSuccess(true);
                        setTimeout(() => {
                            setLoading(false);
                            setCurrentUserAccount({
                                ...data.account,
                                taxData: taxData,
                                loans: userLoans,
                                minecraftBalance: userBalances ? userBalances.balance : 0,
                                shopTransactions: userShopTransactions,
                                jobTransactions: userJobTransactions,
                                messages: userMessages,
                                taxPayments: userTaxPayments
                            });
                            setCurrentPage('home');
                            setLoginSuccess(false);
                        }, 1500);
                    } else {
                        const errorData = await response.json();
                        setLoading(false);
                        showModal('Login Failed', errorData.message || 'Invalid credentials. Please try again.', 'error');
                    }
                } catch (error) {
                    console.error("Login API error:", error);
                    setLoading(false);
                    showModal('Error', 'Could not connect to the server. Please try again later.', 'error');
                }
            };

            const handleCreateAccount = async (newData) => {
                try {
                    const response = await fetch(`${API_ENDPOINTS.ACCOUNTS}/create-account`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newData),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // No need to update local storage here, worker handles persistence
                        return true;
                    } else {
                        const errorData = await response.json();
                        showModal('Creation Failed', errorData.message || 'Failed to create account.', 'error');
                        return false;
                    }
                } catch (error) {
                    console.error("Create account API error:", error);
                    showModal('Error', 'Could not connect to the server to create account.', 'error');
                    return false;
                }
            };

            const handleLogout = () => { setCurrentUserAccount(null); setSession(null); setCurrentPage('login'); showModal('Logged Out', 'You have been successfully logged out.', 'info'); };

            const updateCurrentUser = async (updatedAccount) => {
                try {
                    const response = await fetch(`${API_ENDPOINTS.ACCOUNTS}/update-account`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedAccount),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setCurrentUserAccount(data.account); // Update with fresh data from worker
                        return true;
                    } else {
                        const errorData = await response.json();
                        showModal('Update Failed', errorData.message || 'Failed to update account.', 'error');
                        return false;
                    }
                } catch (error) {
                    console.error("Update account API error:", error);
                    showModal('Error', 'Could not connect to the server to update account.', 'error');
                    return false;
                }
            };

            const handleUpdateProfile = async (profileData) => {
                const updatedAccount = { ...currentUserAccount, ...profileData };
                const success = await updateCurrentUser(updatedAccount);
                if (success) {
                    showModal('Success', 'Your profile has been updated.', 'success');
                } else {
                    showModal('Error', 'Failed to update profile.', 'error');
                }
            };

            const handleChangePassword = async (oldPass, newPass) => {
                if (currentUserAccount.password !== oldPass) { showModal('Error', 'Old password is incorrect.', 'error'); return; }
                const updatedAccount = { ...currentUserAccount, password: newPass };
                await updateCurrentUser(updatedAccount);
                showModal('Success', 'Password changed successfully!', 'success');
            };

         const handlePayTax = async (amount, isFullTax = false) => {
    if (currentUserAccount.balance < amount) {
        showModal('Error', 'Insufficient balance.', 'error');
        return;
    }

    setPaymentAnimationDetails({ show: true, amount: amount, status: 'processing', paymentType: isFullTax ? 'fullTax' : 'customTax' });

    try {
        const response = await fetch(`${API_ENDPOINTS.TAX}/pay-tax`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player: currentUserAccount.accountId,
                amount
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const updatedAccount = {
                ...currentUserAccount,
                balance: currentUserAccount.balance - amount,
                taxData: data.taxData,
                transactions: [
                    ...currentUserAccount.transactions,
                    {
                        type: 'debit',
                        amount: -amount,
                        date: new Date().toISOString(),
                        description: `Tax payment`
                    }
                ]
            };
            setCurrentUserAccount(updatedAccount); // Immediately update the state
            setPaymentAnimationDetails({ show: true, amount: amount, status: 'success', paymentType: isFullTax ? 'fullTax' : 'customTax' });
        } else {
            const errorData = await response.json();
            setPaymentAnimationDetails({ show: true, amount: amount, status: 'error' });
            showModal('Error', errorData.message || 'Failed to pay tax.', 'error');
        }
    } catch (error) {
        console.error("Pay tax API error:", error);
        setPaymentAnimationDetails({ show: true, amount: amount, status: 'error' });
        showModal('Error', 'Could not connect to the tax service.', 'error');
    }
};


const handleAdvanceTax = async (amount) => {
    if (currentUserAccount.balance < amount) {
        showModal('Error', 'Insufficient balance.', 'info');
        return;
    }

    setPaymentAnimationDetails({ show: true, amount: amount, status: 'processing', paymentType: 'advanceTax' });

    try {
        const response = await fetch(`${API_ENDPOINTS.TAX}/advance-tax`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player: currentUserAccount.accountId,
                amount
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const updatedAccount = {
                ...currentUserAccount,
                balance: currentUserAccount.balance - amount,
                taxData: data.taxData,
                transactions: [
                    ...currentUserAccount.transactions,
                    {
                        type: 'debit',
                        amount: -amount,
                        date: new Date().toISOString(),
                        description: `Advance tax payment`
                    }
                ]
            };
            setCurrentUserAccount(updatedAccount); // Immediately update the state
            setPaymentAnimationDetails({ show: true, amount: amount, status: 'success', paymentType: 'advanceTax' });
        } else {
            const errorData = await response.json();
            setPaymentAnimationDetails({ show: true, amount: amount, status: 'error' });
            showModal('Error', errorData.message || 'Failed to pay advance tax.', 'error');
        }
    } catch (error) {
        console.error("Advance tax API error:", error);
        setPaymentAnimationDetails({ show: true, amount: amount, status: 'error' });
        showModal('Error', 'Could not connect to the tax service.', 'error');
    }
};


            const handleApplyLoan = async ({ amount, duration, type, purpose, coord1, coord2, playerScreenshot, landPhoto, valueOfLand, valueOfBuilding, areaVolume, loanerNetWorth }) => {
                amount = parseFloat(amount); // Ensure amount is a number
                const jobIncome = currentUserAccount.jobPerDayIncome || 0;
                const bizIncome = currentUserAccount.businessPerDayIncome || 0;
                const maxDailyRepayment = (jobIncome * 0.55) + (bizIncome * (currentUserAccount.businessIncomeUnit === 'hour' ? 0.70 * 8 : 0.70));

                const interestRates = {
                    personal: 0.06,
                    home: 0.02,
                    business: 0.05,
                    bizStartup: [0.02, 0.04, 0.05, 0.06, 0.08], // Weeks 1-5
                    homeStartup: [0.015, 0.02, 0.03, 0.05, 0.07] // Weeks 1-5
                };

                let weeklyRate;
                if (type.includes('Startup')) {
                    weeklyRate = interestRates[type][duration - 1]; // duration is 1-indexed for weeks
                } else {
                    weeklyRate = interestRates[type];
                }

                let totalDue, dailyRepayment;
                const dailyRate = Math.pow(1 + weeklyRate, 1/7) - 1;
                totalDue = amount * Math.pow(1 + dailyRate, duration * 7);
                dailyRepayment = totalDue / (duration * 7);

                // Fetch all loans to check against existing daily repayment
                const allLoansResponse = await fetch(`${API_ENDPOINTS.LOANS}`);
                const allLoansData = await allLoansResponse.json();
                const allLoans = allLoansData || [];

                const existingDailyRepayment = allLoans.filter(loan => loan.accountId === currentUserAccount.accountId && loan.loanStatus === 'active').reduce((sum, loan) => sum + loan.dailyRepayment, 0);

                if (existingDailyRepayment + dailyRepayment > maxDailyRepayment) {
                    showModal('Loan Rejected', `Your income is too low. Your max daily repayment is ${maxDailyRepayment.toFixed(2)}, but this loan would bring it to ${(existingDailyRepayment + dailyRepayment).toFixed(2)}.`, 'error');
                    return;
                }

                const newLoan = { id: `LOAN${Date.now()}`, accountId: currentUserAccount.accountId, loanAmount: amount, loanAmountDue: totalDue, loanPaid: 0, dailyRepayment, durationWeeks: duration, loanType: type, loanStatus: 'pending', applicationDate: new Date().toISOString(), purpose, coord1, coord2, playerScreenshot, landPhoto, valueOfLand, valueOfBuilding, areaVolume, loanerNetWorth };

                try {
                    const response = await fetch(`${API_ENDPOINTS.ACCOUNTS}/apply-loan`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newLoan),
                    });

                    if (response.ok) {
                        showModal('Application Submitted', `Your ${type} loan application for ${amount.toFixed(2)} has been submitted. A bank employee will visit your area for verification.`, 'success');
                        // Refresh current user account to reflect the new loan (status pending)
                        const updatedAccountResponse = await fetch(`${API_ENDPOINTS.ACCOUNTS}/accounts/${currentUserAccount.accountId}`);
                        if (updatedAccountResponse.ok) {
                            const updatedAccountData = await updatedAccountResponse.json();
                            setCurrentUserAccount(updatedAccountData.account);
                        }
                    } else {
                        const errorData = await response.json();
                        showModal('Error', errorData.message || 'Failed to submit loan application.', 'error');
                    }
                } catch (error) {
                    console.error("Loan application API error:", error);
                    showModal('Error', 'Could not connect to the loan service.', 'error');
                }
            };

            const handleCancelLoan = async (loanId) => {
                const updatedLoans = currentUserAccount.loans.filter(loan => loan.id !== loanId);
                const updatedAccount = { ...currentUserAccount, loans: updatedLoans, transactions: [...currentUserAccount.transactions, { type: 'info', amount: 0, date: new Date().toISOString(), description: `Loan application ${loanId} cancelled` }] };
                await updateCurrentUser(updatedAccount);
                showModal('Success', 'Loan application has been cancelled.', 'success');
            };

            const handleAdminApproveLoan = async (loanId) => {
                const loan = currentUserAccount.loans.find(l => l.id === loanId);
                if (!loan) return;

                const updatedLoan = { ...loan, loanStatus: 'approved' };
                const updatedLoans = currentUserAccount.loans.map(l => l.id === loanId ? updatedLoan : l);

                const updatedAccount = {
                    ...currentUserAccount,
                    loans: updatedLoans,
                    balance: currentUserAccount.balance + loan.loanAmount,
                    transactions: [
                        ...currentUserAccount.transactions,
                        { type: 'credit', amount: loan.loanAmount, date: new Date().toISOString(), description: `Loan ${loanId} approved` }
                    ]
                };

                const success = await updateCurrentUser(updatedAccount);
                if (success) {
                    showModal('Admin Action', 'Loan has been approved!', 'success');
                } else {
                    showModal('Error', 'Failed to update account after loan approval.', 'error');
                }
            };

            const handlePayLoan = async (loanId, customAmount = null) => {
                const loan = currentUserAccount.loans.find(l => l.id === loanId);
                if (!loan) return;

                // Auto-cancel if 24 hours passed and loan is pending/active and not fully paid
                const timeSinceApplication = Date.now() - new Date(loan.applicationDate).getTime();
                const twentyFourHours = 24 * 3600 * 1000;

                if (timeSinceApplication >= twentyFourHours && loan.loanStatus !== 'paid' && loan.loanPaid < loan.loanAmountDue) {
                    // Call worker to cancel loan
                    await fetch(`${API_ENDPOINTS.ACCOUNTS}/admin`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'cancel_loan', userAccountId: currentUserAccount.accountId, loanId: loan.id })
                    });
                    showModal('Loan Auto-Cancelled', `Loan ${loan.id} has been automatically cancelled as it was not fully paid within 24 hours.`, 'error');
                    // Refresh user data to reflect cancellation
                    const updatedAccountResponse = await fetch(`${API_ENDPOINTS.ACCOUNTS}/accounts/${currentUserAccount.accountId}`);
                    if (updatedAccountResponse.ok) {
                        const updatedAccountData = await updatedAccountResponse.json();
                        setCurrentUserAccount(updatedAccountData.account);
                    }
                    return; // Stop further processing for this loan
                }

                let amountToPay = customAmount !== null ? customAmount : (loan.loanAmountDue - loan.loanPaid);
                if (amountToPay <= 0) { showModal('Info', 'No amount to pay for this loan.', 'info'); return; }

                let effectiveAmountToPay = amountToPay;

                // Apply interest reduction rules only if paying the full remaining amount
                if (customAmount === null || customAmount >= (loan.loanAmountDue - loan.loanPaid)) {
                    if (timeSinceApplication < 6 * 3600 * 1000) { // 6 hours
                        effectiveAmountToPay = loan.loanAmount; // Only principal
                    } else if (timeSinceApplication < 24 * 3600 * 1000) { // 24 hours
                        const interest = loan.loanAmountDue - loan.loanAmount;
                        effectiveAmountToPay = loan.loanAmount + (interest * 0.45); // 55% interest reduction
                    }
                }

                if (currentUserAccount.balance < effectiveAmountToPay) { showModal('Error', 'Insufficient balance to pay the loan.', 'error'); return; }

                const newLoanPaid = loan.loanPaid + effectiveAmountToPay;
                let newLoanStatus = loan.loanStatus;
                let transactionDescription = `Loan payment for ${loan.id}`;

                if (newLoanPaid >= loan.loanAmountDue) {
                    newLoanStatus = 'closed';
                    transactionDescription = `Paid off loan ${loan.id}`;
                    showModal('Loan Paid!', 'Loan has been fully paid off!', 'success');
                } else {
                    showModal('Payment Successful!', `Paid ${effectiveAmountToPay.toFixed(2)} towards loan ${loan.id}.`, 'success');
                }

                try {
                    const response = await fetch(`${API_ENDPOINTS.ACCOUNTS}/pay-loan`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userAccountId: currentUserAccount.accountId,
                            loanId: loan.id,
                            amountToPay: effectiveAmountToPay,
                            newLoanPaid: newLoanPaid,
                            newLoanStatus: newLoanStatus,
                            transactionDescription: transactionDescription
                        }),
                    });

                    if (response.ok) {
                        const updatedData = await response.json();
                        setCurrentUserAccount(updatedData.accounts.find(acc => acc.accountId === currentUserAccount.accountId));
                    } else {
                        const errorData = await response.json();
                        showModal('Error', errorData.message || 'Failed to process loan payment.', 'error');
                    }
                } catch (error) {
                    console.error("Pay loan API error:", error);
                    showModal('Error', 'Could not connect to the loan payment service.', 'error');
                }
            };

            const renderPage = () => {
                if (loading) return <LoadingScreen loginSuccess={loginSuccess} message={loginSuccess ? 'Login Successful!' : 'Loading Bank Data...'} />;
                const commonProps = { currentUserAccount, setCurrentUserAccount, setCurrentPage, showModal, handleLogout, handleChangePassword, handleUpdateProfile, handlePayTax, handleAdvanceTax, handleApplyLoan, handleCancelLoan, handleAdminApproveLoan, handlePayLoan, session, paymentAnimationDetails, setPaymentAnimationDetails };
                if (!currentUserAccount) {
                    switch (currentPage) {
                        case 'create-account': return <CreateAccountPage {...commonProps} handleCreateAccount={handleCreateAccount} />;
                        default: return <LoginPage {...commonProps} handleLogin={handleLogin} />;
                    }
                }
                let pageComponent;
                switch (currentPage) {
                    case 'account-settings': pageComponent = <AccountSettingsPage {...commonProps} />; break;
                    case 'top-tax-payers': pageComponent = <TopTaxPayersPage {...commonProps} getAllAccounts={getAllAccounts} />; break;
                    case 'top-advance-tax-payers': pageComponent = <TopAdvanceTaxPayersPage {...commonProps} getAllAccounts={getAllAccounts} />; break;
                    case 'contact-us': pageComponent = <ContactUsPage {...commonProps} setNotification={setNotification} />; break;
                    case 'theme-setting': pageComponent = <ThemeSettingsPage {...commonProps} />; break;
                    case 'tax-page': pageComponent = <TaxPage {...commonProps} paymentAnimationDetails={paymentAnimationDetails} setPaymentAnimationDetails={setPaymentAnimationDetails} />; break;
                    default: pageComponent = <Dashboard {...commonProps} />;
                }
                return <MainLayout {...commonProps} notification={notification}>{pageComponent}</MainLayout>;
            };

            return <>{renderPage()}{paymentAnimationDetails.show && <PaymentLoadingAnimation {...paymentAnimationDetails} onAnimationComplete={() => setPaymentAnimationDetails({ show: false, amount: 0, status: 'processing', paymentType: '' })} /> }<Modal {...modal} onClose={closeModal} /></>;
        };

        const PaymentLoadingAnimation = ({ amount, status, onAnimationComplete, paymentType }) => {
            const [message, setMessage] = useState('Processing payment...');
            const [boxClass, setBoxClass] = useState('');

            useEffect(() => {
                let timer;
                if (status === 'success') {
                    let successMessage = `Payment successful!`;
                    if (paymentType === 'fullTax') {
                        successMessage += ` Thanks for paying the tax.`;
                    }
                    else if (paymentType === 'advanceTax') {
                        successMessage += ` Thanks for paying the tax advance.`;
                    }
                    setMessage(successMessage);
                    setBoxClass('success');
                    timer = setTimeout(() => onAnimationComplete(), Math.random() * (1500 - 500) + 500); // Random duration between 0.5 and 1.5 seconds
                } else if (status === 'error') {
                    setMessage('Payment failed. Please try again.');
                    setBoxClass('error');
                    timer = setTimeout(() => onAnimationComplete(), 3000); // Display error for 3 seconds
                } else {
                    setMessage(`Processing payment of ${amount?.toFixed(2) || '0.00'}...`);
                    setBoxClass('');
                }
                return () => clearTimeout(timer);
            }, [status, amount, onAnimationComplete, paymentType]);

            return (
                <div className="payment-loading-overlay">
                    <div className={`payment-loading-box ${boxClass}`}>
                        <div className="payment-dollar-symbol">$</div>
                        <div className="payment-message-text">{message}</div>
                    </div>
                </div>
            );
        };

        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
