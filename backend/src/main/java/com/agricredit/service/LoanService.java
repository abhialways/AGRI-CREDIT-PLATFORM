package com.agricredit.service;

import com.agricredit.dto.LoanRequest;
import com.agricredit.dto.LoanResponse;
import com.agricredit.entity.Loan;
import com.agricredit.entity.User;
import com.agricredit.repository.LoanRepository;
import com.agricredit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    public LoanResponse applyForLoan(LoanRequest loanRequest) {
        // Get farmer by ID
        User farmer = userRepository.findById(loanRequest.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        // Create new loan
        Loan loan = new Loan();
        loan.setFarmer(farmer);
        loan.setAmount(loanRequest.getAmount());
        loan.setPurpose(loanRequest.getPurpose());
        loan.setInterestRate(loanRequest.getInterestRate());
        loan.setDurationInMonths(loanRequest.getDurationInMonths());
        loan.setStatus(Loan.LoanStatus.PENDING);
        loan.setAppliedDate(LocalDateTime.now());

        // Calculate due date
        loan.setDueDate(LocalDateTime.now().plusMonths(loanRequest.getDurationInMonths()));

        // Mock blockchain integration - generate a fake transaction hash
        loan.setBlockchainTransactionHash(generateBlockchainTransactionHash(loan));

        Loan savedLoan = loanRepository.save(loan);
        return LoanResponse.fromEntity(savedLoan);
    }

    public LoanResponse approveLoan(Long loanId, Long lenderId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != Loan.LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }

        User lender = userRepository.findById(lenderId)
                .orElseThrow(() -> new RuntimeException("Lender not found"));

        loan.setLender(lender);
        loan.setStatus(Loan.LoanStatus.APPROVED);
        loan.setApprovedDate(LocalDateTime.now());

        Loan updatedLoan = loanRepository.save(loan);
        return LoanResponse.fromEntity(updatedLoan);
    }

    public LoanResponse rejectLoan(Long loanId, String remarks) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != Loan.LoanStatus.PENDING) {
            throw new RuntimeException("Loan is not in pending status");
        }

        loan.setStatus(Loan.LoanStatus.REJECTED);
        loan.setRemarks(remarks);
        
        Loan updatedLoan = loanRepository.save(loan);
        return LoanResponse.fromEntity(updatedLoan);
    }

    public LoanResponse disburseLoan(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != Loan.LoanStatus.APPROVED) {
            throw new RuntimeException("Loan is not approved");
        }

        loan.setStatus(Loan.LoanStatus.DISBURSED);
        loan.setDisbursementDate(LocalDateTime.now());

        Loan updatedLoan = loanRepository.save(loan);
        return LoanResponse.fromEntity(updatedLoan);
    }

    public List<LoanResponse> getLoansByFarmer(Long farmerId) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        
        List<Loan> loans = loanRepository.findByFarmer(farmer);
        return loans.stream()
                .map(LoanResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LoanResponse> getLoansByLender(Long lenderId) {
        User lender = userRepository.findById(lenderId)
                .orElseThrow(() -> new RuntimeException("Lender not found"));
        
        List<Loan> loans = loanRepository.findByLender(lender);
        return loans.stream()
                .map(LoanResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LoanResponse> getAllLoans() {
        List<Loan> loans = loanRepository.findAll();
        return loans.stream()
                .map(LoanResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public LoanResponse getLoanById(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        return LoanResponse.fromEntity(loan);
    }

    private String generateBlockchainTransactionHash(Loan loan) {
        // Mock blockchain transaction hash generation
        String data = loan.getFarmer().getId() + "_" + 
                     loan.getAmount() + "_" + 
                     loan.getAppliedDate().toString();
        return "0x" + java.util.UUID.nameUUIDFromBytes(data.getBytes()).toString().replace("-", "");
    }
}