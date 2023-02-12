import DashBoardNav from '../DashBoardNav';
import classes from './CustomerDetail.module.scss';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import avatar from './../../../img/avatar.svg';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
// import { singleCustomer } from '../../../store/realCustomers/getSingleCustomerSlice';
import { useState } from 'react';
import axios from 'axios';
import LoadingScreen from '../../UI/LoadingScreen';
import NotFoundPlaceholder from './NotFoundPlaceholder';
import { EDUKE_URL } from '../../../store/url';
import ModalDetail from '../ModalDetail';
import { formatCurr } from '../../../utils/currencyFormater';
// qot-cedj-uvm

function CustomerDetail() {
    // getSingleLoan
    // const singleLoan = useSelector(state => state.getSingleLoan);
    const { token } = useSelector(state => state.auth);

    // console.log({token});

    // states
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [customer, setCustomer] = useState(null);
    const [loan, setLoan] = useState([]);
    const [beneficiary, setBeneficiary] = useState([]);
    const [transactions, setTransactions] = useState([]);


    const [showDetailModal, setDetailModal] = useState(false);

    const { customerId } = useParams();

    // console.log({ all });

    // console.log({ all, loading, error, loan, customer, beneficiary });


    // THE OUTLET CONTEXT STATE
    const [openSideBarHandler] = useOutletContext();

    useEffect(() => {
        // dispatch(singleCustomer({token, id: customerId}));

        async function getOneCustomer() {

            setLoading(true);
            try {
                const response = await axios({
                    url: `${EDUKE_URL}/edike/api/v1/users/admin/get-a-customer/${customerId}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-admin-token': token
                    }
                });

                setLoading(false);
                // console.lo('All ', response.data);

                if (response.data.all) {
                    setAll(response.data.all);
                    setBeneficiary(response.data.all[1].beneficiary);
                    setCustomer(response.data.all[0].user);
                    setLoan(response.data.all[2].loan);
                    setTransactions(response.data.all[3].transaction);
                }

            } catch (err) {
                setLoading(false);

                if (err.response && err.response.data && err.response.data.msg) {
                    setError(err.response && err.response.data && err.response.data.msg);
                }
            }
        }

        getOneCustomer();

    }, [token, customerId]);



    return (
        <>
            {loading && <LoadingScreen />}
            <DashBoardNav 
            navTitle={`Customer - ${customer && customer.firstname} ${customer && customer.lastname}`}
                // onAddSchool={drawerDisplayHandler} 
                onOpenSidebar={openSideBarHandler}
                btnText='Add User'
                showSearchNav={false}
            />
            <div className={classes['customer-detail']}>
                <div className={classes['customer-detail__inner']}>
                    <Link to='/dashboard/customers' style={{ fontSize: '3rem', display: 'inline-block', color: '#111' }}><i className="fas fa-long-arrow-left"></i></Link>
                    <div className={classes['customer-detail__group']}>
                        <h1 className={classes['customer-detail__heading']}>Customer Details</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={classes['td__fullname']}>
                                            {customer && customer.profileImage ? <img src={customer.profileImage} alt={'User Avatar'} /> : <img src={avatar} alt={'User Avatar'} />}
                                            <h3>{(customer && customer.firstname) || '-'} {(customer && customer.lastname) || '-'}</h3>
                                        </div>
                                    </td>
                                    <td>
                                        i. {(customer && customer.residence_address) || '-'}
                                        <br />
                                        ii. {(customer && customer.houseAddress) || '-'}
                                    </td>
                                    <td>{(customer && customer.phone) || '-'}</td>
                                    <td>{(customer && customer.email) || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <h1 style={{ marginTop: '3rem' }} className={classes['customer-detail__heading']}>Next of kin Details</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={classes['td__fullname']}>
                                            <h3>
                                                {(customer && customer.nextofkinfirstname) || '-'} {(customer && customer.nextofkinlastname) || '-'}
                                            </h3>
                                        </div>
                                    </td>
                                    <td>
                                        {(customer && customer.nextofkinaddress) || '-'}
                                    </td>
                                    <td>
                                        {(customer && customer.nextofkinphonenumber) || '-'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <button onClick={() => setDetailModal(true)}>Customer Details</button>
                    </div>
                    <div className={classes['customer-detail__group']}>
                        <h1 className={classes['customer-detail__heading']}>Beneficiaries</h1>
                        {beneficiary && beneficiary.length > 0 && (<table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>School</th>
                                    <th>Class</th>
                                    <th>Date Of Birth</th>
                                    <th>Gender</th>
                                </tr>
                            </thead>
                            <tbody>
                                {beneficiary && beneficiary.map(ben => {
                                    return (
                                        <tr key={ben._id}>
                                            <td>
                                                <div className={classes['td__fullname']}>
                                                    {ben.beneficiaryImage ? <img src={ben.beneficiaryImage} alt={'User Avatar'} /> : <img src={avatar} alt={'User Avatar'} />}
                                                    <h3>{ben.firstname || '-'} {ben.lastname || '-'}</h3>
                                                </div>
                                            </td>
                                            <td>{ben.school || '-'}</td>
                                            <td>{ben.studentClass || '-'}</td>
                                            <td>
                                                {/* 17th July 2023  */}
                                                {ben.dob || '-'}
                                                {/* {new Date('22/2/2019').toLocaleString()} */}
                                            </td>
                                            <td>{ben.gender || '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>)}
                        {beneficiary.length === 0 && <NotFoundPlaceholder title='Beneficiary added'>No beneficiary has been added by this customer. Beneficiaries added by the customer will reflect here</NotFoundPlaceholder>}
                    </div>
                    <div className={classes['customer-detail__group']}>
                        <h3 className={classes['customer-detail__heading']}>Loan</h3>
                        {loan && loan.length > 0 && (<table className={classes.loan__table}>
                            <thead>
                                <tr>
                                    {/* <th>Loan Id</th> */}
                                    <th>Beneficiary</th>
                                    <th>School</th>
                                    <th>Class</th>
                                    <th>Loan Amount</th>
                                    <th>Loan Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loan.map((ln, index) => {
                                    return (
                                        <tr key={ln._id}>
                                            {/* <td>#EDI-{index + 1}</td> */}
                                            <td>{ln?.beneficiaryDetails[0]?.firstname || '-'} {ln?.beneficiaryDetails[0]?.lastname || '-'}</td>
                                            <td>{ln?.beneficiaryDetails[0]?.school || '-'}</td>
                                            <td>{ln?.beneficiaryDetails[0]?.studentClass || '-'}</td>
                                            <td>{(ln.beneficiary_amount && formatCurr(ln.beneficiary_amount)) || '-'}</td>
                                            <td>
                                                {/* <span className={classes['active-loan']}>Active</span> */}
                                                <span className={classes[ln.status + '-loan']}>{ln.status && ln.status.split('_').join(' ')}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>)}
                        {loan.length === 0 && <NotFoundPlaceholder title='Loans Running'>User has not applied for any loans yet.</NotFoundPlaceholder>}
                    </div>
                    <div className={classes['customer-detail__group']}>
                        <h3 className={classes['customer-detail__heading']}>Transactions</h3>
                        {transactions && transactions.length > 0 && (<table className={classes.loan__table}>
                            <thead>
                                <tr>
                                    <th>Transaction Date</th>
                                    <th>Transaction Type</th>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction, index) => {
                                    return (
                                        <tr key={transaction._id}>
                                            <td>{(transaction.createdAt && new Date(transaction.createdAt).toDateString()) || '-'}</td>
                                            <td>{transaction.channel || '-'}</td>
                                            <td>{transaction.amount === 5000 ? 'Card Tokenization' : 'Matured Loan Repayment'}</td>
                                            <td>{transaction.amount && formatCurr(parseInt(transaction.amount / 100, 10))}</td>
                                            <td>
                                                <span className={classes['active-loan']}
                                                    style={{ backgroundColor: `${transaction.status !== 'success' && 'rgba(255, 52, 54, .1)'}`, color: `${transaction.status !== 'success' && '#FF3436'}` }}
                                                >{transaction.status || '-'}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>)}
                        {transactions.length === 0 && <NotFoundPlaceholder title='Transactions to Display'>This user has not perform any transaction.</NotFoundPlaceholder>}
                    </div>
                    <div className={classes['customer-detail__group']}>
                        <div className={classes.images}>
                            <div>
                                <h4>Utility bill</h4>
                                <a href={beneficiary_file_results && beneficiary_file_results[0]?.secure_url} download='utility-bill'>
                                <img src={customer && customer.houseAddressLink && customer.houseAddressLink[0]?.secure_url} alt='' />
                                </a>
                            </div>
                            <div>
                                <h4>Id Card</h4>
                                <a href={beneficiary_file_results && beneficiary_file_results[0]?.secure_url} download='id-card'>
                                <img src={customer && customer.idcard && customer.idcard[0]?.secure_url} alt='' />
                                </a>
                            </div>
                            <div>
                                <h4>Debit Card</h4>
                                <a href={beneficiary_file_results && beneficiary_file_results[0]?.secure_url} download='utility-bill'>
                                <img src={customer && customer.idcard && customer.idcard[0]?.secure_url} alt='' />
                                </a>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div> 

            <ModalDetail
                info={customer || {}}
                isModalVisible={showDetailModal}
                onClose={() => setDetailModal(false)}
            />
        </>
    );
}

export default CustomerDetail;