package com.laborconnect.backend.repository;

import com.laborconnect.backend.entity.SiteGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteGroupRepository extends JpaRepository<SiteGroup, Long> {

    List<SiteGroup> findByThekedarId(Long thekedarId);
}
