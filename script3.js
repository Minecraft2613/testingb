
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
                                const userJobTransactions = jobTransactionsData.filter(tx => tx.player === data.account.accountId);
                                const userMessages = messagesData.filter(msg => msg.username === data.account.accountId);
                                const userTaxPayments = taxPaymentsData.filter(tx => tx.player === data.account.accountId);

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
