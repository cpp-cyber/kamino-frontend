import { toast } from "sonner";
import {
  deployPod,
  clonePodTemplates,
  createUsers,
  deleteUsers,
  bulkAddUsersToGroup,
  bulkRemoveUsersFromGroup,
  createGroups,
  deleteGroups,
  renameGroup,
} from "./api";
import { CreateUsersRequest } from "./types";

/**
 * Centralized admin operations with immediate toast feedback
 */

// ============================================================================
// POD DEPLOYMENT OPERATIONS
// ============================================================================

/**
 * Handles user pod deployment with consistent toast messaging
 */
export async function handleUserPodDeployment(
  podName: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  // Show immediate feedback
  toast.info(`Deploying "${podName.replaceAll("_", " ")}"...`, {
    duration: 15000, // Long duration for deployment operations
  });

  try {
    await deployPod(podName);
    console.log(`Successfully deployed pod: ${podName}`);

    // Simple success toast without redundant information
    toast.success(`"${podName.replaceAll("_", " ")}" deployed successfully!`);

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to deploy pod:", error);
    const deploymentError =
      error instanceof Error ? error : new Error("Unknown deployment error");

    toast.error(`Failed to deploy "${podName.replaceAll("_", " ")}"`);

    if (onError) {
      onError(deploymentError);
    } else {
      throw deploymentError;
    }
  }
}

/**
 * Handles admin bulk pod deployment with consistent toast messaging
 */
export async function handleAdminPodDeployment(
  template: string,
  usernames: string[],
  groups: string[],
  startingVmId?: number,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const targetCount = usernames.length + groups.length;

  // Show immediate feedback
  toast.info(
    `Deploying "${template}" to ${targetCount} target${targetCount === 1 ? "" : "s"}...`,
    {
      duration: 20000, // Extra long duration for bulk operations
    },
  );

  try {
    await clonePodTemplates(template, usernames, groups, startingVmId);
    console.log(
      `Successfully deployed template: ${template} to ${targetCount} targets`,
    );

    // Simple success toast
    toast.success(
      `"${template}" deployed to ${targetCount} target${targetCount === 1 ? "" : "s"}`,
    );

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to deploy pod templates:", error);
    const deploymentError =
      error instanceof Error ? error : new Error("Unknown deployment error");

    // Admin gets detailed error message
    toast.error(`Failed to deploy "${template}": ${deploymentError.message}`);

    if (onError) {
      onError(deploymentError);
    } else {
      throw deploymentError;
    }
  }
}

// ============================================================================
// USER MANAGEMENT OPERATIONS
// ============================================================================

/**
 * Handles user creation with immediate feedback
 */
export async function handleCreateUsers(
  users: CreateUsersRequest[],
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const userCount = users.length;
  const isSingle = userCount === 1;

  // Show immediate feedback
  toast.info(
    `Creating ${isSingle ? `user "${users[0].username}"` : `${userCount} users`}...`,
    {
      duration: 10000,
    },
  );

  try {
    await createUsers(users);
    console.log(`Successfully created ${userCount} user(s)`);

    toast.success(
      isSingle
        ? `User "${users[0].username}" created successfully`
        : `${userCount} users created successfully`,
    );

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to create users:", error);
    const createError =
      error instanceof Error ? error : new Error("Unknown creation error");

    toast.error(
      isSingle
        ? `Failed to create user "${users[0].username}": ${createError.message}`
        : `Failed to create ${userCount} users: ${createError.message}`,
    );

    if (onError) {
      onError(createError);
    } else {
      throw createError;
    }
  }
}

/**
 * Handles user deletion with immediate feedback
 */
export async function handleDeleteUsers(
  usernames: string[],
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const userCount = usernames.length;
  const isSingle = userCount === 1;

  // Show immediate feedback
  toast.info(
    `Deleting ${isSingle ? `user "${usernames[0]}"` : `${userCount} users`}...`,
    {
      duration: 10000,
    },
  );

  try {
    await deleteUsers(usernames);
    console.log(`Successfully deleted ${userCount} user(s)`);

    toast.success(
      isSingle
        ? `User "${usernames[0]}" deleted successfully`
        : `${userCount} users deleted successfully`,
    );

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to delete users:", error);
    const deleteError =
      error instanceof Error ? error : new Error("Unknown deletion error");

    toast.error(
      isSingle
        ? `Failed to delete user "${usernames[0]}": ${deleteError.message}`
        : `Failed to delete ${userCount} users: ${deleteError.message}`,
    );

    if (onError) {
      onError(deleteError);
    } else {
      throw deleteError;
    }
  }
}

/**
 * Handles user group operations with immediate feedback
 */
export async function handleUserGroupOperation(
  usernames: string[],
  groupName: string,
  action: "add" | "remove",
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const userCount = usernames.length;
  const isSingle = userCount === 1;
  const actionVerb = action === "add" ? "Adding" : "Removing";
  const preposition = action === "add" ? "to" : "from";
  const actionPast = action === "add" ? "added to" : "removed from";

  // Show immediate feedback
  toast.info(
    `${actionVerb} ${isSingle ? `user "${usernames[0]}"` : `${userCount} users`} ${preposition} group "${groupName}"...`,
    {
      duration: 8000,
    },
  );

  try {
    if (action === "add") {
      await bulkAddUsersToGroup(usernames, groupName);
    } else {
      await bulkRemoveUsersFromGroup(usernames, groupName);
    }
    console.log(
      `Successfully ${actionPast} group "${groupName}": ${userCount} user(s)`,
    );

    toast.success(
      isSingle
        ? `User "${usernames[0]}" ${actionPast} group "${groupName}"`
        : `${userCount} users ${actionPast} group "${groupName}"`,
    );

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error(`Failed to ${action} users ${preposition} group:`, error);
    const groupError =
      error instanceof Error
        ? error
        : new Error(`Unknown group ${action} error`);

    toast.error(
      isSingle
        ? `Failed to ${action} user "${usernames[0]}" ${preposition} group "${groupName}": ${groupError.message}`
        : `Failed to ${action} ${userCount} users ${preposition} group "${groupName}": ${groupError.message}`,
    );

    if (onError) {
      onError(groupError);
    } else {
      throw groupError;
    }
  }
}

// ============================================================================
// GROUP MANAGEMENT OPERATIONS
// ============================================================================

/**
 * Handles group creation with immediate feedback
 */
export async function handleCreateGroups(
  groupNames: string[],
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const groupCount = groupNames.length;
  const isSingle = groupCount === 1;

  // Show immediate feedback
  toast.info(
    `Creating ${isSingle ? `group "${groupNames[0]}"` : `${groupCount} groups`}...`,
    {
      duration: 8000,
    },
  );

  try {
    await createGroups(groupNames);
    console.log(`Successfully created ${groupCount} group(s)`);

    toast.success(
      isSingle
        ? `Group "${groupNames[0]}" created successfully`
        : `${groupCount} groups created successfully`,
    );

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to create groups:", error);
    const createError =
      error instanceof Error ? error : new Error("Unknown creation error");

    toast.error(
      isSingle
        ? `Failed to create group "${groupNames[0]}": ${createError.message}`
        : `Failed to create ${groupCount} groups: ${createError.message}`,
    );

    if (onError) {
      onError(createError);
    } else {
      throw createError;
    }
  }
}

/**
 * Handles group deletion with immediate feedback
 */
export async function handleDeleteGroups(
  groupNames: string[],
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const groupCount = groupNames.length;
  const isSingle = groupCount === 1;

  // Show immediate feedback
  toast.info(
    `Deleting ${isSingle ? `group "${groupNames[0]}"` : `${groupCount} groups`}...`,
    {
      duration: 8000,
    },
  );

  try {
    await deleteGroups(groupNames);
    console.log(`Successfully deleted ${groupCount} group(s)`);

    toast.success(
      isSingle
        ? `Group "${groupNames[0]}" deleted successfully`
        : `${groupCount} groups deleted successfully`,
    );

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to delete groups:", error);
    const deleteError =
      error instanceof Error ? error : new Error("Unknown deletion error");

    toast.error(
      isSingle
        ? `Failed to delete group "${groupNames[0]}": ${deleteError.message}`
        : `Failed to delete ${groupCount} groups: ${deleteError.message}`,
    );

    if (onError) {
      onError(deleteError);
    } else {
      throw deleteError;
    }
  }
}

/**
 * Handles group renaming with immediate feedback
 */
export async function handleRenameGroup(
  oldName: string,
  newName: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
): Promise<void> {
  // Show immediate feedback
  toast.info(`Renaming group "${oldName}" to "${newName}"...`, {
    duration: 8000,
  });

  try {
    await renameGroup(oldName, newName);
    console.log(`Successfully renamed group: ${oldName} -> ${newName}`);

    toast.success(`Group renamed from "${oldName}" to "${newName}"`);

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error("Failed to rename group:", error);
    const renameError =
      error instanceof Error ? error : new Error("Unknown rename error");

    toast.error(`Failed to rename group "${oldName}": ${renameError.message}`);

    if (onError) {
      onError(renameError);
    } else {
      throw renameError;
    }
  }
}
