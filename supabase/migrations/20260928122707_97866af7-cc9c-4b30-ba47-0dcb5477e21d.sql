CREATE UNIQUE INDEX user_roles_single_admin_idx ON public.user_roles (role);

CREATE POLICY "Portfolio owner can claim initial admin role"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'admin'
  AND lower(COALESCE(auth.jwt() ->> 'email', '')) = lower('sujouldhali9@gmail.com')
  AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
);