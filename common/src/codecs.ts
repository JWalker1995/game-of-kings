import * as t from 'io-ts';

const opt = <InnerType extends t.Any>(type: InnerType) =>
	t.union([type, t.undefined]);
const orNull = <InnerType extends t.Any>(type: InnerType) =>
	t.union([type, t.null]);

export const SubMsgCodec = t.string;
export const UnsubMsgCodec = t.string;

export const AuthCodec = t.strict({
	token: t.string,
});

export const UserCodec = t.strict({
	username: t.string,
	rating: t.number,
});

export const VariantCodec = t.strict({
	radius: t.number,
	formation: t.keyof({
		monarchy: null,
		diarchy: null,
		triarchy: null,
		colonies: null,
	}),
	spawnsAvailable: t.number,
	timeInitialMs: t.number,
	timeIncrementMs: t.number,
	stakes: t.number,
});

export const ChallengeCodec = t.strict({
	id: t.string,
	challengerId: t.string,
	opponentId: opt(t.string),
	ratingMin: opt(t.number),
	ratingMax: opt(t.number),
	variant: VariantCodec,
	acceptDate: opt(t.number),
	matchId: opt(t.string),
});
export const LobbyStateCodec = t.strict({
	users: t.array(t.string),
	challenges: t.array(ChallengeCodec),
});
export const AcceptChallengeCodec = t.strict({
	challengeId: t.string,
	acceptorId: t.string,
	acceptDate: t.number,
	matchId: t.string,
});

export const PieceCodec = t.strict({
	playerIndex: t.number,
	type: t.keyof({ king: null, pawn: null }),
});
export const MoveCodec = t.strict({
	date: t.number,
	type: t.keyof({
		movePiece: null,
		spawnPiece: null,
		offerDraw: null,
		resign: null,
	}),
});
export const moveTypeCodecs = {
	movePiece: t.strict({
		...MoveCodec.type.props,
		fromIndex: t.number,
		toIndex: t.number,
	}),
	spawnPiece: t.strict({
		...MoveCodec.type.props,
		fromIndex: t.number,
		toIndex: t.number,
	}),
	offerDraw: t.strict({ ...MoveCodec.type.props }),
	resign: t.strict({ ...MoveCodec.type.props }),
};
export const TimeoutCodec = t.strict({
	winner: t.number,
});
export const ChatCodec = t.strict({
	date: t.number,
	userId: t.string,
	msg: t.string,
});
export const MatchCodec = t.strict({
	variant: VariantCodec,
	log: t.array(MoveCodec),
	players: t.array(
		t.strict({
			userId: t.string,
			spawnsAvailable: t.number,
			timeForMoveMs: t.number,
		}),
	),
	playerToMove: t.number,
	moveStartDate: t.number,
	cells: t.array(orNull(PieceCodec)),
	chat: t.array(ChatCodec),
	status: t.keyof({
		playing: null,
		aborted: null,
		drawn: null,
		checkmate: null,
		timeout: null,
	}),
	winner: opt(t.number),
});
export const MatchPartialCodec = t.exact(
	t.partial({
		...MatchCodec.type.props,
		players: t.array(
			t.exact(t.partial(MatchCodec.type.props.players.type.type.props)),
		),
	}),
);