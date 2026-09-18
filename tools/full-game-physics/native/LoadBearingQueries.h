// Original LOAD BEARING integration helpers. No changes to the contact solver,
// integration step, material model, body geometry, or solver iteration counts.
#pragma once
#include <Jolt/Physics/Body/Body.h>
#include <Jolt/Physics/Constraints/FixedConstraint.h>
#include <Jolt/Physics/Constraints/PointConstraint.h>
#include <Jolt/Physics/Constraints/SixDOFConstraint.h>
#include <vector>
#include <cstdint>

// Non-owning registrations. The JS integration rebuilds registrations before
// capture whenever bodies/constraints change, and destroys this object first.
// Capture is only legal between completed PhysicsSystem updates on the worker.
class LoadBearingQueries {
    std::vector<const JPH::Body *> mBodies;
    std::vector<const JPH::TwoBodyConstraint *> mJoints;
    std::vector<float> mPoses, mLambdas;
public:
    void ClearBodies() { mBodies.clear(); }
    void AddBody(const JPH::Body &body) { mBodies.push_back(&body); }
    void ClearJoints() { mJoints.clear(); }
    void AddJoint(const JPH::TwoBodyConstraint &joint) { mJoints.push_back(&joint); }
    unsigned GetBodyCount() const { return unsigned(mBodies.size()); }
    unsigned GetJointCount() const { return unsigned(mJoints.size()); }
    unsigned GetPoseAddress() const { return unsigned(reinterpret_cast<uintptr_t>(mPoses.data())); }
    unsigned GetLambdaAddress() const { return unsigned(reinterpret_cast<uintptr_t>(mLambdas.data())); }
    void CapturePoses() {
        mPoses.resize(mBodies.size() * 14);
        for (size_t i = 0; i < mBodies.size(); ++i) {
            const JPH::Body &b = *mBodies[i];
            const auto p = b.GetPosition(); const auto q = b.GetRotation();
            const auto v = b.GetLinearVelocity(); const auto w = b.GetAngularVelocity();
            float *out = mPoses.data() + i * 14;
            out[0] = float(p.GetX()); out[1] = float(p.GetY()); out[2] = float(p.GetZ());
            out[3] = q.GetX(); out[4] = q.GetY(); out[5] = q.GetZ(); out[6] = q.GetW();
            out[7] = v.GetX(); out[8] = v.GetY(); out[9] = v.GetZ();
            out[10] = b.IsActive()? 1.0f : 0.0f;
            out[11] = w.GetX(); out[12] = w.GetY(); out[13] = w.GetZ();
        }
    }
    void CaptureLambdas() {
        mLambdas.resize(mJoints.size() * 4);
        for (size_t i = 0; i < mJoints.size(); ++i) {
            const JPH::TwoBodyConstraint &c = *mJoints[i];
            JPH::Vec3 linear = JPH::Vec3::sZero(), angular = JPH::Vec3::sZero();
            switch (c.GetSubType()) {
                case JPH::EConstraintSubType::Fixed: {
                    const auto &j = static_cast<const JPH::FixedConstraint &>(c);
                    linear = j.GetTotalLambdaPosition(); angular = j.GetTotalLambdaRotation(); break;
                }
                case JPH::EConstraintSubType::SixDOF: {
                    const auto &j = static_cast<const JPH::SixDOFConstraint &>(c);
                    linear = j.GetTotalLambdaPosition(); angular = j.GetTotalLambdaRotation(); break;
                }
                case JPH::EConstraintSubType::Point:
                    linear = static_cast<const JPH::PointConstraint &>(c).GetTotalLambdaPosition(); break;
                default: break; // The integration only registers these three types.
            }
            float *out = mLambdas.data() + i * 4;
            out[0] = linear.Length(); out[1] = angular.GetX(); out[2] = angular.GetY(); out[3] = angular.GetZ();
        }
    }
};
