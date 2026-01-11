-- Add new columns to user_properties table
ALTER TABLE public.user_properties
ADD COLUMN IF NOT EXISTS floor integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS furnished boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS usage_type text DEFAULT 'residential',
ADD COLUMN IF NOT EXISTS contact text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS videos text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS rejection_reason text DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.user_properties.floor IS 'Floor number of the property';
COMMENT ON COLUMN public.user_properties.furnished IS 'Whether the property is furnished';
COMMENT ON COLUMN public.user_properties.usage_type IS 'Usage type: residential, commercial, etc.';
COMMENT ON COLUMN public.user_properties.contact IS 'Contact information for the property';
COMMENT ON COLUMN public.user_properties.videos IS 'Array of video URLs';
COMMENT ON COLUMN public.user_properties.rejection_reason IS 'Reason for rejection if status is rejected';