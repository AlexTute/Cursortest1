import { getAdminClient } from "./supabaseAdmin";

/**
 * Validate an API key and return its details
 * @param {string} apiKey - The API key to validate
 * @returns {Promise<{valid: boolean, keyData?: object, error?: string}>}
 */
export async function validateApiKey(apiKey) {
  try {
    if (!apiKey || typeof apiKey !== 'string') {
      return { valid: false, error: 'Invalid API key format' };
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("api_keys")
      .select("id,name,value,usage,usage_count,created_at,updated_at")
      .eq("value", apiKey)
      .single();

    if (error) {
      console.error("Error validating API key:", error);
      return { valid: false, error: 'Database error during validation' };
    }

    if (!data) {
      return { valid: false, error: 'API key not found' };
    }

    // Check if usage limit is exceeded
    if (data.usage && data.usage_count >= data.usage) {
      return { 
        valid: false, 
        error: 'API key usage limit exceeded',
        keyData: {
          id: data.id,
          name: data.name,
          usageCount: data.usage_count,
          usageLimit: data.usage
        }
      };
    }

    return {
      valid: true,
      keyData: {
        id: data.id,
        name: data.name,
        key: data.value,
        usageLimit: data.usage,
        usageCount: data.usage_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at || data.created_at,
      }
    };

  } catch (error) {
    console.error("Unexpected error in validateApiKey:", error);
    return { valid: false, error: 'Internal server error' };
  }
}

/**
 * Increment usage count for an API key
 * @param {string} apiKey - The API key to increment usage for
 * @param {number} increment - Amount to increment by (default: 1)
 * @returns {Promise<{success: boolean, keyData?: object, error?: string}>}
 */
export async function incrementApiKeyUsage(apiKey, increment = 1) {
  try {
    const validation = await validateApiKey(apiKey);
    
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const supabase = getAdminClient();
    const newUsageCount = (validation.keyData.usageCount || 0) + increment;
    
    // Check if this increment would exceed the limit
    if (validation.keyData.usageLimit && newUsageCount > validation.keyData.usageLimit) {
      return { 
        success: false, 
        error: 'Usage limit would be exceeded',
        keyData: validation.keyData
      };
    }

    const { data, error } = await supabase
      .from("api_keys")
      .update({ 
        usage_count: newUsageCount,
        updated_at: new Date().toISOString()
      })
      .eq("id", validation.keyData.id)
      .select()
      .single();

    if (error) {
      console.error("Error incrementing API key usage:", error);
      return { success: false, error: 'Failed to update usage count' };
    }

    return {
      success: true,
      keyData: {
        id: data.id,
        name: data.name,
        key: data.value,
        usageLimit: data.usage,
        usageCount: data.usage_count || 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at || data.created_at,
      }
    };

  } catch (error) {
    console.error("Unexpected error in incrementApiKeyUsage:", error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Generate a secure API key
 * @param {string} prefix - Prefix for the key (default: 'ak_')
 * @returns {string} Generated API key
 */
export function generateApiKey(prefix = 'ak_') {
  const timestamp = Date.now().toString(36);
  const random1 = Math.random().toString(36).slice(2);
  const random2 = Math.random().toString(36).slice(2);
  const random3 = Math.random().toString(36).slice(2);
  
  return `${prefix}${timestamp}_${random1}${random2}${random3}`;
}

/**
 * Check if an API key format is valid
 * @param {string} apiKey - The API key to check
 * @returns {boolean} Whether the format is valid
 */
export function isValidApiKeyFormat(apiKey) {
  if (!apiKey || typeof apiKey !== 'string') return false;
  
  // Check if it starts with 'ak_' and has sufficient length
  return apiKey.startsWith('ak_') && apiKey.length >= 20;
}
