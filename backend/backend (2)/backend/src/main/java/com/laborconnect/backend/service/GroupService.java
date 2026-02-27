package com.laborconnect.backend.service;

import com.laborconnect.backend.dto.GroupRequest;
import com.laborconnect.backend.entity.*;
import com.laborconnect.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GroupService {

    private final SiteGroupRepository siteGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public GroupService(SiteGroupRepository siteGroupRepository,
            GroupMemberRepository groupMemberRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.siteGroupRepository = siteGroupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public SiteGroup createGroup(Long thekedarId, GroupRequest request) {
        User thekedar = userRepository.findById(thekedarId)
                .orElseThrow(() -> new RuntimeException("Thekedar not found"));

        if (thekedar.getRole() != Role.THEKEDAR) {
            throw new RuntimeException("Only THEKEDARs can create groups");
        }

        SiteGroup group = new SiteGroup();
        group.setThekedar(thekedar);
        group.setName(request.getName());
        group.setPincode(request.getPincode());
        return siteGroupRepository.save(group);
    }

    @Transactional
    public String addLaborerToGroup(Long groupId, Long laborerId) {
        SiteGroup group = siteGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User laborer = userRepository.findById(laborerId)
                .orElseThrow(() -> new RuntimeException("Laborer not found"));

        if (laborer.getRole() != Role.LABORER) {
            throw new RuntimeException("Can only add LABORERs to groups");
        }

        if (groupMemberRepository.existsByGroupIdAndLaborerId(groupId, laborerId)) {
            throw new RuntimeException("Laborer already in this group");
        }

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setLaborer(laborer);
        groupMemberRepository.save(member);

        // Notify the laborer
        notificationService.createNotification(
                laborer,
                "You have been added to group: " + group.getName(),
                NotificationType.GENERAL,
                null);

        return laborer.getName() + " added to group " + group.getName();
    }

    public List<SiteGroup> getThekedarGroups(Long thekedarId) {
        return siteGroupRepository.findByThekedarId(thekedarId);
    }

    public List<SiteGroup> getLaborerGroups(Long laborerId) {
        List<GroupMember> memberships = groupMemberRepository.findByLaborerId(laborerId);
        return memberships.stream()
                .map(GroupMember::getGroup)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<GroupMember> getGroupMembers(Long groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }
}
