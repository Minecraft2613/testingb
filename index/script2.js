
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
                                        let statusText, showCancelButton = false, showPayButton = false;

                                        switch (loan.loanStatus) {
                                            case 'approved':
                                                statusText = loan.forcefullyApproved ? 'Forcefully Approved' : 'Active Loan';
                                                showPayButton = true;
                                                break;
                                            case 'rejected':
                                                statusText = 'Rejected';
                                                break;
                                            case 'closed':
                                                statusText = 'Closed';
                                                break;
                                            case 'waitingForAdminApproval':
                                                statusText = 'Waiting for Admin Approval';
                                                showCancelButton = true;
                                                break;
                                            case 'pending':
                                            case 'waitingForEmployeeApproval':
                                                statusText = 'Pending';
                                                showCancelButton = true;
                                                break;
                                            default:
                                                statusText = loan.loanStatus || 'Unknown Status';
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
