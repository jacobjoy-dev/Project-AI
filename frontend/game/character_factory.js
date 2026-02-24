import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

/**
 * CharacterFactory — Premium Sci-Fi Robot.
 * Camera always looks at the BACK of this character.
 *
 * Design: Sleek matte-dark armor plating with glowing cyan energy lines and
 *         an orange reactor core on the back. Smooth CapsuleGeometry panels
 *         replace the old boxy primitives.
 *
 * Animator API preserved:
 *   { group, torso, headGroup, leftArm, rightArm, leftLeg, rightLeg }
 *   leftArm/rightArm = { shoulder, elbow }
 *   leftLeg/rightLeg = { hip, knee }
 */
export class CharacterFactory {
    static create(scene) {
        const group = new THREE.Group();
        scene.add(group);

        // ─── MATERIALS ─────────────────────────────────────────────────────
        // Primary armor — very dark blue-grey matte
        const armorMat = new THREE.MeshStandardMaterial({
            color: 0x1c2230,
            roughness: 0.45,
            metalness: 0.75,
        });

        // Secondary armor panels — slightly lighter for contrast
        const armorLightMat = new THREE.MeshStandardMaterial({
            color: 0x2c3a55,
            roughness: 0.40,
            metalness: 0.70,
        });

        // Joint rings — polished silver
        const jointMat = new THREE.MeshStandardMaterial({
            color: 0x8899bb,
            roughness: 0.2,
            metalness: 0.9,
        });

        // Glowing cyan energy lines
        const glowMat = new THREE.MeshStandardMaterial({
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            emissiveIntensity: 2.5,
            roughness: 0.1,
            metalness: 0.0,
        });

        // Orange reactor core glow
        const reactorMat = new THREE.MeshStandardMaterial({
            color: 0xff6600,
            emissive: 0xff4400,
            emissiveIntensity: 2.0,
            roughness: 0.1,
            metalness: 0.0,
        });

        // Dark edge trim between panels
        const trimMat = new THREE.MeshStandardMaterial({
            color: 0x0a0e18,
            roughness: 0.6,
            metalness: 0.5,
        });

        // ─── TORSO ─────────────────────────────────────────────────────────
        const torsoGeo = new THREE.CapsuleGeometry(0.22, 0.35, 10, 18);
        const torso = new THREE.Mesh(torsoGeo, armorMat);
        torso.position.y = 1.1;
        torso.castShadow = true;
        group.add(torso);

        // Shoulder width flare — horizontal capsule
        const shFlareGeo = new THREE.CapsuleGeometry(0.28, 0.08, 6, 12);
        const shFlare = new THREE.Mesh(shFlareGeo, armorLightMat);
        shFlare.position.y = 0.2;
        shFlare.rotation.z = Math.PI / 2;
        shFlare.castShadow = true;
        torso.add(shFlare);

        // ── BACK PANEL DETAILS ──────────────────────────────────────────────
        // Central back armor plate (slightly proud of torso surface)
        const backPlateGeo = new THREE.CapsuleGeometry(0.12, 0.22, 6, 12);
        const backPlate = new THREE.Mesh(backPlateGeo, armorLightMat);
        backPlate.position.set(0, 0.04, 0.21);
        backPlate.castShadow = true;
        torso.add(backPlate);

        // Reactor core — pulsing orb in centre of back
        const reactorGeo = new THREE.SphereGeometry(0.055, 14, 10);
        const reactor = new THREE.Mesh(reactorGeo, reactorMat);
        reactor.position.set(0, 0.04, 0.32);
        torso.add(reactor);

        // Reactor rim ring
        const reactorRimGeo = new THREE.TorusGeometry(0.065, 0.012, 8, 24);
        const reactorRim = new THREE.Mesh(reactorRimGeo, jointMat);
        reactorRim.position.set(0, 0.04, 0.31);
        reactorRim.rotation.x = Math.PI / 2;
        torso.add(reactorRim);

        // Left back thruster nozzle
        const thrusterGeo = new THREE.CylinderGeometry(0.045, 0.065, 0.12, 10);
        const thrusterL = new THREE.Mesh(thrusterGeo, trimMat);
        thrusterL.position.set(-0.11, -0.08, 0.27);
        thrusterL.rotation.x = -Math.PI / 2;
        torso.add(thrusterL);

        const thrusterInnerL = new THREE.Mesh(
            new THREE.CylinderGeometry(0.028, 0.028, 0.05, 10),
            glowMat
        );
        thrusterInnerL.position.set(-0.11, -0.08, 0.34);
        thrusterInnerL.rotation.x = -Math.PI / 2;
        torso.add(thrusterInnerL);

        // Right back thruster nozzle
        const thrusterR = new THREE.Mesh(thrusterGeo, trimMat);
        thrusterR.position.set(0.11, -0.08, 0.27);
        thrusterR.rotation.x = -Math.PI / 2;
        torso.add(thrusterR);

        const thrusterInnerR = new THREE.Mesh(
            new THREE.CylinderGeometry(0.028, 0.028, 0.05, 10),
            glowMat
        );
        thrusterInnerR.position.set(0.11, -0.08, 0.34);
        thrusterInnerR.rotation.x = -Math.PI / 2;
        torso.add(thrusterInnerR);

        // Vertical energy channel — left side of back
        const chanLGeo = new THREE.CapsuleGeometry(0.012, 0.26, 4, 8);
        const chanL = new THREE.Mesh(chanLGeo, glowMat);
        chanL.position.set(-0.14, 0.04, 0.225);
        torso.add(chanL);

        // Vertical energy channel — right side of back
        const chanR = new THREE.Mesh(chanLGeo, glowMat);
        chanR.position.set(0.14, 0.04, 0.225);
        torso.add(chanR);

        // Waist belt ring
        const beltGeo = new THREE.TorusGeometry(0.23, 0.022, 8, 32);
        const belt = new THREE.Mesh(beltGeo, jointMat);
        belt.position.y = -0.22;
        belt.rotation.x = Math.PI / 2;
        torso.add(belt);

        // ─── HEAD ──────────────────────────────────────────────────────────
        const headGroup = new THREE.Group();
        headGroup.position.y = 0.52;
        torso.add(headGroup);

        // Helmet — smooth dome
        const helmetGeo = new THREE.SphereGeometry(0.21, 20, 16);
        const helmet = new THREE.Mesh(helmetGeo, armorMat);
        helmet.castShadow = true;
        headGroup.add(helmet);

        // Helmet top fin / crest
        const finGeo = new THREE.CapsuleGeometry(0.025, 0.16, 4, 8);
        const fin = new THREE.Mesh(finGeo, armorLightMat);
        fin.position.set(0, 0.2, 0);
        headGroup.add(fin);

        // Back-of-head sensor strip (glowing cyan band)
        const sensorGeo = new THREE.TorusGeometry(0.185, 0.018, 6, 28, Math.PI * 1.1);
        const sensor = new THREE.Mesh(sensorGeo, glowMat);
        sensor.position.set(0, -0.04, 0);
        sensor.rotation.y = Math.PI / 2 - Math.PI * 0.55;
        headGroup.add(sensor);

        // Neck collar — cylindrical armor piece
        const neckGeo = new THREE.CylinderGeometry(0.10, 0.115, 0.10, 14);
        const neck = new THREE.Mesh(neckGeo, armorLightMat);
        neck.position.y = -0.275;
        neck.castShadow = true;
        headGroup.add(neck);

        // Neck glow ring
        const neckRingGeo = new THREE.TorusGeometry(0.11, 0.010, 6, 24);
        const neckRing = new THREE.Mesh(neckRingGeo, glowMat);
        neckRing.position.y = -0.275;
        neckRing.rotation.x = Math.PI / 2;
        headGroup.add(neckRing);

        // ─── ARMS ──────────────────────────────────────────────────────────
        const createArm = (isLeft) => {
            const side = isLeft ? -1 : 1;

            const shoulder = new THREE.Group();
            shoulder.position.set(side * 0.29, 0.2, 0);
            torso.add(shoulder);

            // Shoulder armor ball (bigger, more defined)
            const shoulderBall = new THREE.Mesh(
                new THREE.SphereGeometry(0.095, 14, 10),
                armorLightMat
            );
            shoulderBall.castShadow = true;
            shoulder.add(shoulderBall);

            // Shoulder glow ring
            const shldrRingGeo = new THREE.TorusGeometry(0.09, 0.010, 6, 20);
            const shldrRing = new THREE.Mesh(shldrRingGeo, glowMat);
            shldrRing.rotation.x = Math.PI / 2;
            shoulder.add(shldrRing);

            // Upper arm — smooth armor capsule
            const upperArm = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.078, 0.28, 8, 14),
                armorMat
            );
            upperArm.position.y = -0.20;
            upperArm.castShadow = true;
            shoulder.add(upperArm);

            // Upper arm side accent stripe
            const stripeGeo = new THREE.CapsuleGeometry(0.012, 0.18, 4, 8);
            const stripe = new THREE.Mesh(stripeGeo, glowMat);
            stripe.position.set(side * 0.07, 0, 0);
            upperArm.add(stripe);

            // Elbow pivot
            const elbow = new THREE.Group();
            elbow.position.y = -0.32;
            upperArm.add(elbow);

            // Elbow joint ball
            const elbowBall = new THREE.Mesh(
                new THREE.SphereGeometry(0.075, 12, 8),
                jointMat
            );
            elbowBall.castShadow = true;
            elbow.add(elbowBall);

            // Elbow glow ring
            const elbowRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.075, 0.010, 6, 18),
                glowMat
            );
            elbowRing.rotation.x = Math.PI / 2;
            elbow.add(elbowRing);

            // Forearm — smooth, slightly slimmer
            const forearm = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.065, 0.26, 8, 14),
                armorLightMat
            );
            forearm.position.y = -0.18;
            forearm.castShadow = true;
            elbow.add(forearm);

            // Wrist / hand — compact angular armored fist
            const hand = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.060, 0.09, 6, 10),
                armorMat
            );
            hand.position.y = -0.22;
            hand.castShadow = true;
            forearm.add(hand);

            return { shoulder, elbow };
        };

        const leftArm = createArm(true);
        const rightArm = createArm(false);

        // ─── LEGS ──────────────────────────────────────────────────────────
        const createLeg = (isLeft) => {
            const side = isLeft ? -1 : 1;

            const hip = new THREE.Group();
            hip.position.set(side * 0.14, -0.40, 0);
            torso.add(hip);

            // Hip ball joint
            const hipBall = new THREE.Mesh(
                new THREE.SphereGeometry(0.10, 12, 8),
                jointMat
            );
            hipBall.castShadow = true;
            hip.add(hipBall);

            // Thigh — wide smooth capsule
            const thigh = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.105, 0.34, 8, 14),
                armorMat
            );
            thigh.position.y = -0.24;
            thigh.castShadow = true;
            hip.add(thigh);

            // Thigh back accent glow stripe
            const thighStripe = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.012, 0.22, 4, 8),
                glowMat
            );
            thighStripe.position.set(0, 0, 0.10);
            thigh.add(thighStripe);

            // Knee pivot
            const knee = new THREE.Group();
            knee.position.y = -0.40;
            thigh.add(knee);

            // Knee armor cap
            const kneeCap = new THREE.Mesh(
                new THREE.SphereGeometry(0.095, 12, 8),
                armorLightMat
            );
            kneeCap.castShadow = true;
            knee.add(kneeCap);

            // Knee glow ring
            const kneeRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.095, 0.010, 6, 20),
                glowMat
            );
            kneeRing.rotation.x = Math.PI / 2;
            knee.add(kneeRing);

            // Shin — slightly slimmer capsule
            const shin = new THREE.Mesh(
                new THREE.CapsuleGeometry(0.088, 0.32, 8, 14),
                armorLightMat
            );
            shin.position.y = -0.22;
            shin.castShadow = true;
            knee.add(shin);

            // Ankle ring
            const ankleRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.085, 0.013, 6, 20),
                jointMat
            );
            ankleRing.position.y = -0.38;
            ankleRing.rotation.x = Math.PI / 2;
            shin.add(ankleRing);

            // Foot — angular armored boot
            const footGeo = new THREE.CapsuleGeometry(0.07, 0.18, 6, 10);
            const foot = new THREE.Mesh(footGeo, armorMat);
            foot.rotation.x = Math.PI / 2;
            foot.position.set(0, -0.42, -0.06);
            foot.castShadow = true;
            shin.add(foot);

            // Boot heel glow dot
            const heelGeo = new THREE.SphereGeometry(0.022, 8, 6);
            const heel = new THREE.Mesh(heelGeo, glowMat);
            heel.position.set(0, -0.42, 0.07);
            shin.add(heel);

            return { hip, knee };
        };

        const leftLeg = createLeg(true);
        const rightLeg = createLeg(false);

        // ─── RETURN (same API as CharacterAnimator expects) ────────────────
        return {
            group,
            torso,
            headGroup,
            leftArm,
            rightArm,
            leftLeg,
            rightLeg,
        };
    }
}
