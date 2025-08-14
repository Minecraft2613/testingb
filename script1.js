
        const { useState, useEffect, useMemo, useRef } = React; // Added a comment to trigger re-parse

        // --- CONFIGURATION (Cloudflare Worker URLs) ---
        const API_ENDPOINTS = {
            ACCOUNTS: 'https://bank-data.1987sakshamsingh.workers.dev',
            TAX: 'https://bank-data.1987sakshamsingh.workers.dev',
            CONTACT: 'https://bank-data.1987sakshamsingh.workers.dev/contact',
            BALANCES: 'https://bank-data.1987sakshamsingh.workers.dev/bal.json',
            SHOP_TRANSACTIONS: 'https://bank-data.1987sakshamsingh.workers.dev/shop-tran.json',
            JOB_TRANSACTIONS: 'https://bank-data.1987sakshamsingh.workers.dev/job-tran.json',
            LOANS: 'https://bank-data.1987sakshamsingh.workers.dev/loans',
            MESSAGES: 'https://bank-data.1987sakshamsingh.workers.dev/messages',
            TAX_PAYMENTS: 'https://bank-data.1987sakshamsingh.workers.dev/tax-pay-data',
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
            </div>
        );

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
