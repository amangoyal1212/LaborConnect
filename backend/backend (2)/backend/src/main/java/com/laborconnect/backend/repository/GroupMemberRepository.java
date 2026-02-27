package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findByGroupId(Long groupId);

    boolean existsByGroupIdAndLaborerId(Long groupId, Long laborerId);

    List<GroupMember> findByLaborerId(Long laborerId);
}
