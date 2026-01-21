package com.agricredit.repository;

import com.agricredit.entity.Loan;
import com.agricredit.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByFarmer(User farmer);
    List<Loan> findByLender(User lender);
    List<Loan> findByStatus(Loan.LoanStatus status);
    List<Loan> findByFarmerAndStatus(User farmer, Loan.LoanStatus status);
    List<Loan> findByLenderAndStatus(User lender, Loan.LoanStatus status);
}