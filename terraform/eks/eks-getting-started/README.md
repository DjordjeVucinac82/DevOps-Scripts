# EKS Getting Started Guide Configuration

This is the full configuration from https://www.terraform.io/docs/providers/aws/guides/eks-getting-started.html

See that guide for additional information.

NOTE: This full configuration utilizes the [Terraform http provider](https://www.terraform.io/docs/providers/http/index.html) to call out to icanhazip.com to determine your local workstation external IP for easily configuring EC2 Security Group access to the Kubernetes servers. Feel free to replace this as necessary.

After terraform output kubeconfig > ~/.kube/config delete << EOF at beggining and at the end of file, it's not working with EOF \
Edit in .kube/config `apiVersion: client.authentication.k8s.io/v1alpha1` \
Add aws profile into /.kube/config \
      `user:
         exec:
           apiVersion: client.authentication.k8s.io/v1alpha1
           env:
             - name: AWS_PROFILE
               value: "awsdjole"`
 Download aws-iam-authenticator: \
 `https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html` \
