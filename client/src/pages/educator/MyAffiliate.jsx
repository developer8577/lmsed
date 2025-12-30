import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAffiliate = () => {
    const { userData, currency, backendUrl, getToken, fetchUserData, user } = useContext(AppContext)
    const [referrals, setReferrals] = useState([])
    const [payouts, setPayouts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const fetchAffiliateStats = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/user/get-affiliate-stats', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setReferrals(data.referrals)
                setPayouts(data.payouts)
                setLoading(false)
            } else {
                toast.error(data.message)
                setLoading(false)
            }
        } catch (error) {
            toast.error(error.message)
            setLoading(false)
        }
    }

    const handleWithdrawal = async () => {
        if (!userData || !userData.affiliateEarnings || userData.affiliateEarnings <= 0) return;
        setIsWithdrawing(true);
        try {
            const token = await getToken();
            const { data } = await axios.post(backendUrl + '/api/user/request-payout',
                { amount: userData.affiliateEarnings },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                fetchAffiliateStats(); // Refresh lists
                fetchUserData(); // Refresh balance
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsWithdrawing(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchAffiliateStats()
        }
    }, [user])

    if (loading) return <Loading />

    const affiliateLink = `${window.location.origin}/course-list?ref=${user?.id}`

    return (
        <div className='h-screen flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0 overflow-y-scroll'>
            <div className='space-y-5 pb-20'>
                <div className="bg-white border border-blue-100 p-6 rounded-2xl shadow-sm">
                    <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Affiliate Dashboard</h2>
                    <p className='text-gray-600 mb-6'>Share your unique link and earn 5% commission on every course purchased through it.</p>

                    <div className='flex flex-col md:flex-row gap-6 mb-8'>
                        <div className='flex-1 bg-blue-50/50 border border-blue-100 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden'>
                            <img src={assets.earning_icon} alt="" className="absolute -bottom-4 -right-4 w-24 opacity-10" />
                            <div>
                                <p className='text-sm text-gray-500 mb-1'>Total Earnings</p>
                                <p className='text-3xl font-bold text-gray-800'>{currency}{userData?.affiliateEarnings ? userData.affiliateEarnings.toFixed(2) : 0}</p>
                            </div>
                            {userData?.affiliateEarnings > 0 && (
                                <button
                                    onClick={handleWithdrawal}
                                    disabled={isWithdrawing}
                                    className={`mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition w-fit flex items-center gap-2 ${isWithdrawing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isWithdrawing ? 'Processing...' : 'Withdraw Earnings'}
                                </button>
                            )}
                        </div>

                        <div className='flex-[2] bg-gray-50 border border-gray-100 p-6 rounded-xl'>
                            <p className='text-sm text-gray-500 mb-2'>Your Affiliate Link</p>
                            <div className='flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-lg'>
                                <input
                                    type="text"
                                    readOnly
                                    value={affiliateLink}
                                    className='flex-1 outline-none text-gray-600 text-sm'
                                />
                                <button
                                    onClick={() => { navigator.clipboard.writeText(affiliateLink); toast.success('Link copied!') }}
                                    className='px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition'
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Referrals Table */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Referrals</h3>
                        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Student Name</th>
                                        <th scope="col" className="px-6 py-3">Course Title</th>
                                        <th scope="col" className="px-6 py-3">Amount</th>
                                        <th scope="col" className="px-6 py-3">Commission</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referrals.length > 0 ? (
                                        referrals.map((referral) => (
                                            <tr key={referral._id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    {referral.studentName}
                                                </td>
                                                <td className="px-6 py-4">{referral.courseTitle}</td>
                                                <td className="px-6 py-4">{currency}{referral.amount}</td>
                                                <td className="px-6 py-4 text-green-600 font-medium">{currency}{referral.commission}</td>
                                                <td className="px-6 py-4">{new Date(referral.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No referrals yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payout History Table */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payout History</h3>
                        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Requests ID</th>
                                        <th scope="col" className="px-6 py-3">Amount</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payouts.length > 0 ? (
                                        payouts.map((payout) => (
                                            <tr key={payout._id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                    #{payout._id.slice(-6)}
                                                </td>
                                                <td className="px-6 py-4">{currency}{payout.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${payout.status === 'processed' ? 'bg-green-100 text-green-800' :
                                                        payout.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{new Date(payout.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                No payout requests.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default MyAffiliate
